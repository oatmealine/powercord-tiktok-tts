const { React } = require('powercord/webpack');
const { SelectInput, SliderInput } = require('powercord/components/settings');
const { runTTS } = require('./api.js');

// https://github.com/oscie57/tiktok-voice/blob/main/codes.md
const voices = [
	['en_us_001',                  'English US - Female 1 (Int. 1)'],
	['en_us_002',                  'English US - Female 1 (Int. 2)'],
	['en_us_006',                  'English US - Male 1'],
	['en_us_007',                  'English US - Male 2'],
	['en_us_009',                  'English US - Male 3'],
	['en_us_010',                  'English US - Male 4'],
	['en_uk_001',                  'English UK - Male 1'],
	['en_uk_003',                  'English UK - Male 2'],
	['en_au_001',                  'English AU - Female'],
	['en_au_002',                  'English AU - Male'],
	['fr_001',                     'French - Male 1'],
	['fr_002',                     'French - Male 2'],
	['de_001',                     'German - Female'],
	['de_002',                     'German - Male'],
	['es_002',                     'Spanish - Male'],
	['es_mx_002',                  'Spanish MX - Male'],
	['br_001',                     'Portuguese BR - Female 1'],
	['br_003',                     'Portuguese BR - Female 2'],
	['br_004',                     'Portuguese BR - Female 3'],
	['br_005',                     'Portuguese BR - Male'],
	['id_001',                     'Indonesian - Female'],
	['jp_001',                     'Japanese - Female 1'],
	['jp_003',                     'Japanese - Female 2'],
	['jp_005',                     'Japanese - Female 3'],
	['jp_006',                     'Japanese - Male'],
	['kr_002',                     'Korean - Male 1'],
	['kr_004',                     'Korean - Male 2'],
	['kr_003',                     'Korean - Female'],
	['en_us_ghostface',            'Ghostface (Scream)'],
	['en_us_chewbacca',            'Chewbacca (Star Wars)'],
	['en_us_c3po',                 'C3PO (Star Wars)'],
	['en_us_stitch',               'Stitch (Lilo & Stitch)'],
	['en_us_stormtrooper',         'Stormtrooper (Star Wars)'],
	['en_us_rocket',               'Rocket (Guardians of the Galaxy)'],
	['en_female_f08_salut_damour', 'Alto - singing voice'],
	['en_male_m03_lobby',          'Tenor - singing voice'],
	['en_male_m03_sunshine_soon',  'Sunshine Soon - singing voice'],
	['en_female_f08_warmy_breeze', 'Warmy Breeze - singing voice'],
].map(v => ({value: v[0], label: v[1]}));

module.exports = class TikTokTTSSettings extends React.PureComponent {
	render() {
		const { getSetting, updateSetting } = this.props;
		return <>
			<SelectInput
				options={voices}
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
