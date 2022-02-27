import { MyRequest, Router } from './router';

export interface CustomEvent {
	Method: string;
	Path: string;
}

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
	app.test({ Method: 'GET', Path: '/foo' });
	console.log();

	console.log('CASE 2#: another method');
	app.test({ Method: 'POST', Path: '/foo' });
	console.log();

	console.log('CASE 3#: path parameter');
	app.test({ Method: 'GET', Path: '/foo/test' });
	console.log();

	console.log('CASE 4#: not found');
	app.test({ Method: 'DELETE', Path: '/foo/test' });
	console.log();

	console.log('CASE 5#: return value');
	let result = app.test({ Method: 'GET', Path: '/foo/return/test' });
	console.log(result);
	console.log();
}

main();
