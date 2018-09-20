import applyDecoratedDescriptor from '@babel/runtime/helpers/esm/applyDecoratedDescriptor'
import initializerDefineProperty from '@babel/runtime/helpers/esm/initializerDefineProperty'

Object.assign(babelHelpers, {
  applyDecoratedDescriptor,
  initializerDefineProperty,
});

require('./bootstrap')
