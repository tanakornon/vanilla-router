import { pathToRegexp, match, parse, compile, Key } from 'path-to-regexp';

type Parameter = { [key: string]: string };

export interface MyEvent {
	method: string;
	path: string;
}

export interface MyRequest {
	header: Parameter;
	query: Parameter;
	params: Parameter;
}

interface Route {
	method: string;
	path: string;
	handler: Function;
}

export class Router {
	private stack: Route[];

	constructor() {
		this.stack = [];
	}

	private addRoute(method: string, path: string, handler: Function) {
		this.stack.push({ method, path, handler });
	}

	public get(path: string, handler: Function) {
		this.addRoute('GET', path, handler);
	}

	public post(path: string, handler: Function) {
		this.addRoute('POST', path, handler);
	}

	public put(path: string, handler: Function) {
		this.addRoute('PUT', path, handler);
	}

	public delete(path: string, handler: Function) {
		this.addRoute('DELETE', path, handler);
	}

	private parsePathParams(reqPath: string, pattern: string): Parameter {
		const result: Parameter = {};

		const keys: Key[] = [];
		const regex = pathToRegexp(pattern, keys);
		const params = regex.exec(reqPath)?.filter((_, index) => index > 0);

		if (params) {
			keys.forEach((key, index) => {
				const name = key.name.toString();
				result[name] = params[index];
			});
		}

		return result;
	}

	public test(event: MyEvent): any {
		const matchRoute = this.stack
			.filter((route) => {
				const matchPath = pathToRegexp(route.path).exec(event.path);
				const matchMethod = route.method === event.method;
				return matchPath && matchMethod;
			})
			.shift();

		if (!matchRoute) {
			console.log('Path or Method not found!');
			return;
		}

		const reqParams: MyRequest = {
			header: {},
			query: {},
			params: this.parsePathParams(event.path, matchRoute.path),
		};

		return matchRoute.handler(reqParams);
	}
}
