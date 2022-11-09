import config from "../config.js";
import { formBuilder, tagDatabases, requestBuilder, time } from "../../patchy_api/modules.js";
const { profilePictures } = config;
formBuilder.create('playerProfile', {
	action: (receiver) => {
		const { properties: { profilePictureId = 0 } } = receiver;
		return ([
			{
				title: 'Profile',
				body: `\nName: §7${receiver.name}\n§aMoney: §2$${receiver.scores.money ?? 0}\n `
			},
			{
				button: {
					text: 'Profile Picture\n§e§oPress to Change',
					iconPath: profilePictures[profilePictureId],
				},
				callback: (receiver) => {
					formBuilder.show(receiver, 'changeProfilePicture');
				}
			}
		]);
	}
});

formBuilder.create('changeProfilePicture', {
	action: [
		{
			title: 'Profile Picture',
			body: `Select your new Profile Picture.\n\n§e§oCredits: Images from Hristiyan Dodov which used Unsplash`
		},
		(receiver) => {
			return profilePictures.map((iconPath, i) => ({
				button: {
					text: `Profile Picture ${i}`,
					iconPath,
				},
				callback: () => {
					formBuilder.showConformation(receiver, `Are you sure you want to change your profile picture to Profile Picture ${i}?`, () => {
						receiver.properties.profilePictureId = i;
						const { name, id, properties: { profilePictureId } } = receiver;
						const playerStorage = tagDatabases.get(receiver, 'playerStorage');
						const friends = playerStorage.get('friends');
						const { requests: { incoming = {}, outgoing = {} } = {}, mutal = {} } = friends ?? {};
						playerStorage.set('savedName', name);
						mutal.forEach(idTarget => {
							requestBuilder.add('friends', id, idTarget, 'profilePictureChange', { profilePictureId, date: time.now() });
						});
						incoming.forEach(idTarget => {
							requestBuilder.add('friends', id, idTarget, 'profilePictureChange', { profilePictureId, date: time.now() });
						});
						outgoing.forEach(idTarget => {
							requestBuilder.add('friends', id, idTarget, 'profilePictureChange', { profilePictureId, date: time.now() });
						});

					});
				}
			}));
		}

	]
});