const { ESLint } = require('eslint');

async function runLint() {
  const eslint = new ESLint({
    useEslintrc: true,
    ignore: true,
    ignorePatterns: [
      'lib/generated/**/*',
      'node_modules/**/*',
      '.next/**/*',
      'out/**/*'
    ]
  });

  try {
    const results = await eslint.lintFiles(['**/*.{ts,tsx}']);
    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);
    
    if (resultText) {
      console.log(resultText);
    } else {
      console.log('✅ No ESLint errors found!');
    }
  } catch (error) {
    console.error('ESLint error:', error.message);
  }
}

runLint(); 