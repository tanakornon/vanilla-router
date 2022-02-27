import { pathToRegexp, match, parse, compile, Key } from 'path-to-regexp';
import { CustomEvent } from './index';

export interface MyRequest {
	header: { [key: string]: string };
	query: { [key: string]: string };
	params: { [key: string]: string };
}

type CallbackFunction = (req: MyRequest) => any;

interface Route {
	Method: string;
	Path: string;
	Callback: CallbackFunction;
}

export class Router {
	private routes: Route[];

	constructor() {
		this.routes = [];
	}

	private buildRoute(
		method: string,
		path: string,
		fn: CallbackFunction
	): Route {
		return {
			Method: method,
			Path: path,
			Callback: fn,
		};
	}

	public get(path: string, fn: CallbackFunction) {
		this.routes.push(this.buildRoute('GET', path, fn));
	}

	public post(path: string, fn: CallbackFunction) {
		this.routes.push(this.buildRoute('POST', path, fn));
	}

	public put(path: string, fn: CallbackFunction) {
		this.routes.push(this.buildRoute('PUT', path, fn));
	}

	public delete(path: string, fn: CallbackFunction) {
		this.routes.push(this.buildRoute('DELETE', path, fn));
	}

	public test(event: CustomEvent): any {
		const matchRoute = this.routes
			.filter((route) => {
				const matchPath = pathToRegexp(route.Path).exec(event.Path);
				const matchMethod = route.Method === event.Method;
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
			params: {},
		};

		const keys: Key[] = [];
		const regex = pathToRegexp(matchRoute.Path, keys);
		const params = regex.exec(event.Path)?.filter((_, index) => index > 0);

		if (params) {
			keys.forEach((key, index) => {
				const name = key.name.toString();
				reqParams.params[name] = params[index];
			});
		}

		return matchRoute.Callback(reqParams);
	}
}
