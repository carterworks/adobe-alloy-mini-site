const createLogger = ({ console, instanceName }) => {
	return {
		info(...args) {
			console.info(`[${instanceName}]`, ...args);
		},
		error(...args) {
			console.error(`[${instanceName}]`, ...args);
		},
		warn(...args) {
			console.warn(`[${instanceName}]`, ...args);
		},
		debug(...args) {
			console.debug(`[${instanceName}]`, ...args);
		},
	};
};
const createConfigure = ({ logger }) => {
	return {
		name: 'configure',
		optionsValidator(options) {
			// TODO: reject if the datastreamId or orgId are missing
			return options?.datastreamId instanceof String && options?.orgId instanceof String;
		},
		async handler(args) {
			logger.info(
				'Configuring Alloy with datastreamId',
				args.datastreamId,
				'and orgId',
				args.orgId,
			);
			// TODO: save the configuration for later and provide it to other commands
		},
	};
};
const createSendEvent = ({ logger }) => {
	return {
		name: 'sendEvent',
		optionsValidator(options) {
			// TODO: reject if the eventName or eventProperties are missing
			return false;
		},
		async handler(args) {
			logger.info('Sending event', args.eventName, 'with properties', args.eventProperties);
			// TODO: send the event to the server
			const API_ENDPOINT = '/api/send-event';
		},
	};
};
const createRenderPersonalizations = ({ logger }) => {
	return {
		name: 'renderPersonalizations',
		optionsValidator(options) {
			return true;
		},
		async handler(args) {
			logger.info('Fetching personalizations');
			const API_ENDPOINT = '/api/personalizations';
			const response = await fetch(API_ENDPOINT);
			if (!response.ok) {
				logger.error('Failed to fetch personalizations', response.statusText);
				return [];
			}
			const personalizations = await response.json();
			// TODO: render the personalizations
			return personalizations;
		},
	};
};
export const createAlloy = (instanceName) => {
	const logger = createLogger({ console, instanceName });
	// TODO: create a datastore to save options and configurations
	const commandDependencies = {
		logger,
	};
	const commands = [
		createConfigure(commandDependencies),
		createSendEvent(commandDependencies),
		createRenderPersonalizations(commandDependencies),
		// TODO: implement "getVersion" command
		// TODO: implement "clearCookie" command
	];
	const commandRegistry = new Map();
	for (const command of commands) {
		commandRegistry.set(command.name, command);
	}
	logger.info('Alloy instance created', { instanceName });
	return async (commandName, ...args) => {
		const command = commandRegistry.get(commandName);
		if (!command) {
			logger.error('Command not found', commandName);
			throw new Error(`Command not found: ${commandName}`);
		}
		if (!command.optionsValidator(args)) {
			logger.error('Invalid arguments', args);
			throw new Error(`Invalid arguments: ${args}`);
		}
		logger.debug('Executing command', commandName, 'with arguments', args);
		return command.handler(args);
	};
};
function isStringArr(arr) {
	return Array.isArray(arr) && arr.every((el) => typeof el === 'string');
}
function init() {
	const instancesNames = window.__alloyNS;
	if (!isStringArr(instancesNames)) {
		throw new Error('window.__alloyNS must be of type Array<string>');
	}
	for (const name of instancesNames) {
		window[name] = createAlloy(name);
		document.dispatchEvent(new Event(`alloy:${name}:ready`));
	}
}
init();
