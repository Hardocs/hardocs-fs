import { __DEV__ } from './utils/constants';

if (!__DEV__) {
	/** Disable console.log */
	// console.log = () => {}
}
export * from './modules';
