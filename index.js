// lots of code borrowed from view-raw:
// https://github.com/Juby210/view-raw/blob/master/index.js

const { Plugin } = require("powercord/entities");
const { getModule, React } = require("powercord/webpack");
const { post } = require('powercord/http');
const { inject, uninject } = require("powercord/injector");

const url = 'https://api16-normal-useast5.us.tiktokv.com/media/api/text/speech/invoke/?text_speaker=en_us_001&req_text=';

module.exports = class ViewRaw extends Plugin {
	startPlugin() {
		this.addButtons();
	}

	pluginWillUnload() {
		this.addButtons(true, true);
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
                const postUrl = url + encodeURIComponent(args[0].message.content);
                let res = await post(postUrl);
                if (res.statusCode != 200 || res.body === '' || res.body.message != 'success') {
                  powercord.api.notices.sendToast('tiktok-tts', {
                    header: 'Error',
                    content: 'TikTok TTS returned an error: ' + (res.body ? res.body.message : res.statusCode),
                    type: 'danger',
                    icon: 'error'
                  });
                } else {
                  let audio = new Audio('data:audio/mp3;base64,' + res.body.data.v_str);
                  audio.volume = 0.5;
                  audio.play();
                }
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
