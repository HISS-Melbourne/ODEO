# ODEO

ODEO is an interactive sound and visualizer tool that allows you to mix textures, loops, and effects to create unique soundscapes and visuals. With 30 sounds across 3 modes, you can experiment and create something new every time.

Each click, tap, or key press triggers a new animation and sound. ODEO works across desktop, Android, iOS, and iPad, and lets you switch between different colour themes and animation styles.

## Getting Started

To create your own version of ODEO, you’ll first need to download or clone the project files. Once you’ve done that, ensure you have the sound files in the same folder as the project files (they need to be named correctly – see below). Then, open **index.html** in your browser to start exploring and customising.

- On **Desktop**, click or use the number keys (0-9) to play, and the spacebar to switch modes.
- On **Mobile** or **Tablet**, tap anywhere on the screen to trigger animations and sounds. Tap the far-right side of the screen to switch modes.

## Sound Files

The sound files should be in the same folder as the rest of the project files and need to be named according to the following format:

- `1st_0.mp3`, `1st_1.mp3`, `1st_2.mp3`, ... (for sounds in the first mode)
- `2nd_11.mp3`, `2nd_12.mp3`, `2nd_13.mp3`, ... (for sounds in the second mode)
- `3rd_21.mp3`, `3rd_22.mp3`, `3rd_23.mp3`, ... (for sounds in the third mode)

Just make sure the filenames match what’s in **sketch.js** to make everything work.

## Customising ODEO

Want to make ODEO your own? Here’s how:

1. **Change the sounds**: Replace the sound files with your own (make sure they follow the naming conventions above).
2. **Modify the animations**: Open the **`sketch.js`** file to edit the animations or add new ones.
3. **Customise the styles**: If you want to change how things look, head to the **`style.css`** file to update the visual design or add new themes.
4. **Experiment with the code**: Tinker with the **`sketch.js`** file to add new features, animations, or sound effects.

Once you're done, simply open **index.html** in your browser to see your changes!

## Forking & Deployment

If you’re forking or deploying ODEO, **make sure to delete or modify the `CNAME` file**. This file currently points to the live ODEO site, and if you don’t update it, your project may not work correctly.

- **Delete the `CNAME` file**, or
- **Modify it** with your own custom domain if you're deploying the tool online.

## Licence

This project is licensed under the **MIT Licence**. See the [LICENSE](LICENSE) file for more details.
