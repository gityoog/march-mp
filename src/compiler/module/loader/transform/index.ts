import * as t from '@babel/types'
import * as parser from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import generate from '@babel/generator'
import getJSON from './json'
import State from '../state'
import transformRender from './render'
import getProperties from './properties'
import getWXML from './wxml'
import addReady from './add-ready'
import genData from './gen-data'

export default function transform(source: string, state: State) {
  const file = parser.parse(source, {
    plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy'],
    sourceType: 'module'
  })
  traverse(file, {
    ImportDeclaration: {
      enter: path => {
        if (path.node.specifiers.length === 0) {
          if (/\.(sass|scss|css|wxss)$/.test(path.node.source.value)) {
            state.addCss(path.node.source.value)
            path.remove()
          }
        }
      }
    },
    ExportDefaultDeclaration: {
      enter: path => {
        path.skip()
        const declaration = path.get('declaration')
        if (declaration.isClassDeclaration()) {
          state.setJSON(getJSON(declaration) || {})

          const render = declaration.get('body.body').find(item => {
            if (item.isClassMethod()) {
              const key = item.get('key')
              if (key.isIdentifier()) {
                return key.node.name === 'render'
              }
            }
            return false
          }) as NodePath<t.ClassMethod> | undefined

          if (render) {
            const argument = (render.get('body.body').find(item => {
              return item.isReturnStatement()
            }) as NodePath<t.ReturnStatement> | undefined)?.get('argument')
            if (argument?.isExpression()) {
              addReady(argument)
              genData(argument, state)
              state.setWXML(
                generate(getWXML(argument), { comments: false }).code
              )
            }
            state.before(() => {
              transformRender(render)
            })
          }

          /**
           * export default class -> (class).create({
           *   events: [],
           *   properties: {}
           * }) 
           **/
          path.replaceWith(
            t.expressionStatement(
              t.callExpression(
                t.memberExpression(
                  t.toExpression(
                    declaration.node
                  ),
                  t.identifier('create')
                ),
                [
                  t.objectExpression([
                    t.objectProperty(t.identifier('events'), t.valueToNode(state.events)),
                    t.objectProperty(t.identifier('properties'), t.objectExpression(
                      getProperties(declaration)
                    ))
                  ])
                ]
              )
            )
          )
        }
      }
    }
  })
  state.setGenerator(() => {
    return generate(file, { comments: false }).code
  })
}
