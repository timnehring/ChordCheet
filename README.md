# ChordCheet
Open Source color-coded chord book that helps you keeping all your songs in a neat place!

## Features
- No more scrolling! All parts of a song get resized to fit on the screen
- Colorful! Color-coded parts make it easy to know where you are
- Dark mode! Switch to a dark version to help in dim environments
- Found it! Search for a title or a song to save time
- Store everything! You can also save meta data like capo placement or the bpm of your songs
- For everyone! The app works on Windows, macOS & Linux

## Screenshots
![Main Screen](/screenshots/main_screen.png)
![Add New Screen](/screenshots/addNew_screen.png)

# Development
This app is still in development and still has some bugs. It's also missing some features that are planned for later releases. 

## Known Bugs
- Scaling issues depending on the length of a song
- Text is not centered all the time
- Some characters might not get recognized by the regex and might make some parts to not show up

## Planned Features
- Customizable colors
- Annotations for songs
- Share the active song over the local network for others to see via a link

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Compiles and minifies for production
```
npm run electron:build
```