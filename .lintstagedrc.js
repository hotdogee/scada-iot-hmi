module.exports = {
  '**/*.js': ['prettier-eslint --write', 'git add'],
  '**/*.vue': ['prettier-eslint --write', 'git add']
}
