export default ({ config }) => ({
	...config,
});
export const IS_DEV = process.env.APP_VARIANT === 'development';
export const IS_PROD = process.env.APP_VARIANT === 'production';
