// lots of code borrowed from view-raw:
// https://github.com/Juby210/view-raw/blob/master/index.js

const { Plugin } = require("powercord/entities");
const { getModule, React } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");
const Settings = require('./Settings');
const { runTTS } = require('./api.js');
const { injectContextMenu } = require('powercord/util');

module.exports = class TikTokTTS extends Plugin {
	startPlugin() {
		this.addButtons();
		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: 'Say as TikTok TTS',
			render: Settings,
		});
	}

	pluginWillUnload() {
		this.addButtons(true, true);
		powercord.api.settings.unregisterSettings(this.entityID);
	}

	async addButtons(repatch, unpatch) {
		if (repatch) {
			uninject('tiktok-contextmenu');
			uninject('tiktok-context-lazy-menu');
		}
		if (unpatch) return;

		this.lazyPatchContextMenu('MessageContextMenu', MessageContextMenu => {
			const { MenuGroup, MenuItem } = getModule(['MenuGroup', 'MenuItem'], false)
			inject('tiktok-contextmenu', MessageContextMenu, 'default', (args, res) => {
				if (!args[0]?.message || !res?.props?.children) return res

				res.props.children.splice(
					3,
					0,
					React.createElement(
						MenuGroup,
						null,
						React.createElement(MenuItem, {
							action: async () => {
								runTTS(args[0].message.content, this.settings.get('voice', 'en_us_002'), this.settings.get('volume', 0.5));
							},
							disabled: !args[0].message.content,
							id: 'tiktok-tts',
							label: 'Speak as TikTok TTS',
						})
					)
				)
				return res;
			})
			MessageContextMenu.default.displayName = 'MessageContextMenu';
		})
	}

	async lazyPatchContextMenu(displayName, patch) {
		const filter = m => m.default && m.default.displayName === displayName
		const m = getModule(filter, false)
		if (m) patch(m)
		else {
			const module = getModule([ 'openContextMenuLazy' ], false)
			inject('tiktok-context-lazy-menu', module, 'openContextMenuLazy', args => {
				const lazyRender = args[1]
				args[1] = async () => {
					const render = await lazyRender(args[0])

					return (config) => {
						const menu = render(config)
						if (menu?.type?.displayName === displayName && patch) {
							uninject('tiktok-context-lazy-menu')
							patch(getModule(filter, false))
							patch = false
						}
						return menu
					}
				}
				return args
			}, true)
		}
	}
};

exports = runTTS;