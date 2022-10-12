// import print from './print';

const button = document.createElement('button');
button.innerText = 'Click me';

button.onclick = async () => {
  const { another } = await import(/* webpackPrefetch: true */ './another');
  // print('printing message');
  console.log(another)
}

document.body.appendChild(button)