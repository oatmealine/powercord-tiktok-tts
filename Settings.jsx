
const { React } = require('powercord/webpack');
const { SelectInput, SliderInput } = require('powercord/components/settings');
const { runTTS } = require('./api.js');

module.exports = class TikTokTTSSettings extends React.PureComponent {
	render() {
		const { getSetting, updateSetting } = this.props;
		return <>
			<SelectInput
				options={['en_us_002', 'en_au_001', 'en_au_002', 'en_uk_001', 'en_us_006', 'en_us_ghostface', 'en_us_chewbacca', 'en_us_c3po', 'en_us_stitch', 'en_us_stormtrooper', 'fr_001', 'fr_002', 'de_001', 'de_002', 'jp_001', 'jp_003', 'en_us_rocket', 'es_002'].map(v => ({value: v, label: v}))}
				value={getSetting('voice', 'en_us_002')}
				onChange={change => {
					updateSetting('voice', change.value);
          runTTS('TikTok TTS sample text', change.value, getSetting('volume', 0.5));
				}}
			>
				Voice
			</SelectInput>
			<SliderInput
				minValue={0}
				maxValue={100}
				initialValue={getSetting('volume', 0.5) * 100}
				markers={[0, 50, 100]}
				onValueChange={change => {
					updateSetting('volume', change / 100);
				}}
			>
				Volume
			</SliderInput>
    </>;
	}
};
