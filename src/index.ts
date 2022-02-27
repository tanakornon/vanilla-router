import { MyRequest, Router } from './router';

function main() {
	const app = new Router();

	app.get('/foo', (req: MyRequest) => {
		console.log('get: foo');
	});

	app.post('/foo', (req: MyRequest) => {
		console.log('post: foo');
	});

	app.get('/foo/:bar', (req: MyRequest) => {
		console.log('get: foo/:bar');
		console.log(`params: ${req.params.bar}`);
	});

	app.get('/foo/return/:bar', (req: MyRequest) => {
		return req.params.bar;
	});

	console.log('CASE 1#: basic');
	app.test({ method: 'GET', path: '/foo' });
	console.log();

	console.log('CASE 2#: another method');
	app.test({ method: 'POST', path: '/foo' });
	console.log();

	console.log('CASE 3#: path parameter');
	app.test({ method: 'GET', path: '/foo/test' });
	console.log();

	console.log('CASE 4#: not found');
	app.test({ method: 'DELETE', path: '/foo/test' });
	console.log();

	console.log('CASE 5#: return value');
	let result = app.test({ method: 'GET', path: '/foo/return/test' });
	console.log(result);
	console.log();
}

main();
