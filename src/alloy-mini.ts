import type { APIPersonalization, AlloyEvent } from '../types';

const createLogger = ({ console, instanceName }: { console: Console; instanceName: string }) => {
	return {
		info(...args: unknown[]) {
			console.info(`[${instanceName}]`, ...args);
		},
		error(...args: unknown[]) {
			console.error(`[${instanceName}]`, ...args);
		},
		warn(...args: unknown[]) {
			console.warn(`[${instanceName}]`, ...args);
		},
		debug(...args: unknown[]) {
			console.debug(`[${instanceName}]`, ...args);
		},
	};
};
type Logger = ReturnType<typeof createLogger>;

interface Command<CommandOptions = unknown, CommandReturnType = void> {
	name: string;
	optionsValidator: (options: unknown) => options is CommandOptions;
	handler: (args: CommandOptions) => Promise<CommandReturnType>;
}

interface ConfigureArgs {
	datastreamId: string;
	orgId: string;
}
const createConfigure = ({ logger }: { logger: Logger }): Command<ConfigureArgs> => {
	return {
		name: 'configure',
		optionsValidator(options): options is ConfigureArgs {
			// TODO: reject if the datastreamId or orgId are missing
			return true;
		},
		async handler(args: ConfigureArgs) {
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

const createSendEvent = ({ logger }: { logger: Logger }): Command<AlloyEvent> => {
	return {
		name: 'sendEvent',
		optionsValidator(options): options is AlloyEvent {
			// TODO: reject if the eventName or eventProperties are missing
			return false;
		},
		async handler(args: AlloyEvent) {
			logger.info('Sending event', args.eventName, 'with properties', args.eventProperties);
			// TODO: send the event to the server
			const API_ENDPOINT = '/api/send-event';
		},
	};
};

const createRenderPersonalizations = ({
	logger,
}: {
	logger: Logger;
}): Command<{}, APIPersonalization[]> => {
	return {
		name: 'renderPersonalizations',
		optionsValidator(options): options is {} {
			return true;
		},
		async handler(args: {}) {
			logger.info('Fetching personalizations');
			const API_ENDPOINT = '/api/personalizations';
			const response = await fetch(API_ENDPOINT);
			if (!response.ok) {
				logger.error('Failed to fetch personalizations', response.statusText);
				return [];
			}
			const personalizations = (await response.json()) as APIPersonalization[];
			// TODO: render the personalizations
			return personalizations;
		},
	};
};

const createAlloy = (instanceName: string) => {
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
	const commandRegistry = new Map<string, Command>();
	for (const command of commands) {
		commandRegistry.set(command.name, command);
	}
	logger.info('Alloy instance created', { instanceName });
	return async (commandName: string, ...args: unknown[]): Promise<void> => {
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

const instanceName = 'alloy';
window[instanceName] = createAlloy(instanceName);
