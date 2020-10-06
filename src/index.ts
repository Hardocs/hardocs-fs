import { __DEV__ } from './utils/constants';

if (!__DEV__) {
	/** Disable console.log in production */
	// console.log = () => {}
}
export * from './modules';
