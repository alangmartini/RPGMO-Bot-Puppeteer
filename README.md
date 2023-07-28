# RPG MO Puppeteer Bot

Welcome to the RPG MO Puppeteer Bot! This is a comprehensive automation bot that facilitates RPG MO gameplay. This bot can handle various tasks including gathering resources, combat, and stash management.

## Prerequisites
1. Node.js and npm installed on your machine.
2. Clone this repository.
3. A 2Captcha API Key, for handling captchas.

## Initial Setup
The bot's configuration is done through the `initializer.yaml` file. There is an example file included (`initializer-example.yaml`) in the repository. Simply rename `initializer-example.yaml` to `initializer.yaml` and adjust its content according to your needs.

## 2Captcha Integration
This bot uses the 2Captcha service to automatically solve the captchas that are occasionally presented by RPG MO. You must update the 2Captcha API key in the `2captcha/main.py` file to enable this feature.

## Bot Configuration
The `initializer.yaml` is where you set up the details of your bot instances. For each bot instance, the parameters that can be set include:

  - `username` and `password`: Your RPG MO account login details.
  - `proxy`: A boolean indicating if you want to use a proxy server.
  - `proxy-address` and `proxy-port`: The address and port of the proxy server (required if `proxy` is set to `true`).
  - `proxy-username` and `proxy-password`: Proxy authentication details, if required.
  - `login`: A boolean indicating whether the bot should log in.
  - `act`: A boolean indicating whether the bot should start operating after login.
  - `bot-type`: Determines the bot's behavior. Set to '`gathering`' for resource gathering, '`combat`' for fighting enemies.
  - `enemy-to-fight`: The enemy that the bot should fight (required if `bot-type` is set to '`combat`'). Note: The specified enemy must be in the same map.
  - `target`: The coordinates of the resource to gather (required if `bot-type` is set to '`gathering`').
  - `chest`: The coordinates of the chest where the bot will stash gathered resources.

## Game Data
All game data are exposed in the global scope. You can find new data and methods by logging "this" in the dev console of your browser while playing the game.

## Important Considerations

The target (resource/enemy) should be in the same map as the bot for the bot to function as intended.
This bot operates in a simplistic way, making it open to improvements. Feel free to contribute to make the bot better and more efficient.

## Future Work
We look forward to expanding the bot's functionality in the future, perhaps making it able to traverse different maps and take on more advanced tasks. Contributions are welcome!

## Note
Use this bot responsibly and consider the RPG MO's terms and conditions. Do not use it to harm the game or other players. Enjoy!

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.