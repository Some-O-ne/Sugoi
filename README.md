This is a tool for a game called Grey Hack. It is currently in alpha, so you can help this project by contributing to it

## Getting Started with the Build Environment

### Prerequisites

Before you begin the build process, ensure you have the following tools installed:

- [Visual Studio Code (VS Code)](https://code.visualstudio.com/): A powerful code editor that supports a myriad of programming languages.
- [Greybel VS Extension](https://marketplace.visualstudio.com/items?itemName=ayecue.greybel-vs): A VS Code extension tailored for MiniScript (also known as GreyScript), facilitating a range of functionalities to streamline your development process within Grey Hack.

### Building the Tool

#### Setting Up Your Workspace

1. Clone the repository to your local machine using Git:
   ```
   git clone https://github.com/Some-O-ne/Sugoi
   ```
2. Open the cloned project in Visual Studio Code to set up your workspace.

#### Compiling the Code

1. Navigate to the `main.gs` file within VS Code.
2. Right-click on `main.gs` and select the `Build` option from the context menu. Successful compilation will create a new `build` directory in your project.
3. To deploy the tool in Grey Hack, copy the `installerX.src` files from the `build` folder into the game. Alternatively, you can automate this step by configuring the `Greybel › Create Ingame` setting in the Greybel VS extension.

#### Integrating with Grey Hack

1. Within Grey Hack, build and run each `installerX.src` file.
2. Change your directory to `/root` using the command:
> [!Note]
> The installation directory for the installers can be customized in the Greybel extension settings.
3. Compile the main script to your preferred location in the game with:
   ```
   build main.gs <YourTargetDirectory>
   ```
4. After installation, you may optionally remove all files generated by the installers as they are no longer necessary.

## Getting Started with the Tool

Optionally, you can create init.sugoi file at `/home/<YourUsername>/Config` with commands which will get executed at the start of runtime. This is useful for Atlases, Custom Presets and more
