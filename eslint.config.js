import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
  },
}, {
  ignores: ['test/mock/icons-meta/*.json'],
})
