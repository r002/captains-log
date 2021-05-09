# Changelog

## [Sun - 4/25/21 | Sprint Grape 🍇](#)
- ✨ Add '/scripts' and 'firebase-admin' in order to easily populate Firestore
- ♻️ Rename `Secure.tsx` to `FileViewer.tsx`. Properly implement `FileViewer.tsx`
- 💄 Beautify the 'Secure Asset' page to show a nice message if user is unauthorized to view asset
- ✨ Add Cloud Function to deliver secure assets to authorized users
- ✨ Add 'Secure' page-- add ability to read protected assets from Firebase Storage
- ♻️ Change how `flashAlert` is implemented (refactor this one day to make correct 🤦‍♂️)
- 🍇 Begin Sprint Grape
- TODO: Setup a listener to a firestore collection: `realtimeNotifications`
- TODO: Set `deadline` from admin console which pushes to all client endpoints in real-time
- TODO: After deadline passes, show results of the voting
- TODO: Implement Comments

## [Sat - 4/10/21 | Sprint Fig 🥝](https://github.com/r002/captains-log/pull/41)
- ✨ Begin Sprint Fig
- ✨ Add basic Admin tools
- 🗃 Add Firestore mock data for 'passages'
- ✨ Add 'Candidates' and 'Voting' buttons
- ✨ Begin implmenting 'voting record' functionality
- ✨ Done: After you vote, disable the voting buttons (show what you voted for)
- 🛠 Fix webpack's HMR
- ✨ Add a 'Write' page where users can submit passage candidates (WIP)
- ♻️ Modify 'App.tsx' to bounce all unautheticated users
- ✨ Add sidebar to 'Write' page (WIP)
- ♻️ Move 'changelog' into its own 'changelog.md' file
- ✨ Add overall collapsible sidebar to all pages (WIP)
- 💄 Beautify the sidebar
- ✨ Impl 'deleteVote' firestore api call (WIP)
- ♻️ Change how votes are saved/read to/from firestore
- ✨ Add 'Results' page (WIP)
- ✨ Change the url in the address bar upon page navigation
- ✨ In sidebar: Highlight the page the user is currently looking at
- ♻️ Move 'page' widgets into their own 'pages' dir
- ✨ In sidebar: Add links to 'Admin Console' & 'Write' pages
- ✨ Sidebar: Add ability to navigate to external links
- ✨ Sidebar: Add external link to 'Changelog'
- ✨ Sidebar: Don't render when user is logged out
- ✨ 'Vote' page: Display a giant countdown clock until next coronation

## [Fri - 4/9/21 | Sprint Elderberry 🍒](https://github.com/r002/captains-log/pull/40)
- ✨ Begin adding Wattpad POC page. Add new 'Wattpad' entrypoint to webpack
- 🛂 Add Clark Kent dummy user, update Firestore rules, handle unauthorized users
- ♻️ Move FlashAlert inside NavBar widget
- ✨ Add StoryBoard widget
- 🗃 Update Firestore mock data


## [Thu - 4/1/21 | Sprint Durian 🍈](https://github.com/r002/captains-log/pull/33)
- ♻️ Refactor widgets into 'LogTypes' & 'Inputs' for better organization</li>
- 🛠 Fix package-lock.json</li>
- 🗃 Update 'data/multi-users' with YoutubeLogs dummy data</li>
- ♻️ #27: Begin refactoring global event handlers for 'log actions' into DataContext</li>
- 🔨 Add npm dev script shortcut to start auth/firestore emulators</li>
- ♻️ #27: Finish refactoring global event handlers for 'log actions' into DataContext</li>
- ✨ #31: Add 'Details Pane'. Shows Youttube videos for YT log entries</li>
- ♻️ Change it so 'Welcome Log' is always shown if no user is logged in</li>
- ✨ #31: Improve the 'Details Pane'-- show different pane for ActivityLogs</li>
- ✨ #38: Add up/down keyboard arrow support to navigate logs</li>
- ✨ Add support for parsing 'https://youtu.be/...' vids</li>

## [Mon - 3/29/21 | Sprint Apple 🍎](https://github.com/r002/captains-log/pull/24)
- 🐞 Fix #23: 'FlashAlert' bug. Reset every time the theme changes</li>
- ♻️ Refactor 'ThemeContext' to expose a 'toggler' hook</li>
- ♻️ Refactor the buttons in Navbar to use types</li>
- ✨ #4: Add 'watch' command to add clickable Youtube links in logs</li>
- ♻️ Refactor public config into its own file</li>
- 🐞 Fix IooB bug when processing ActivityLogs to compute durations</li>
- 🐞 Fix bug: Allow dt of YoutubeLogs to be edited</li>
- ♻️ Refactor the way logs are read from db & updated. Use 'Object.assign(..)'</li>
- ♻️🤡 Refactor code in 'Navbar'. Add 'Export Logs' dummy button</li>
- ♻️🤡 Rename all event handlers in 'Navbar'. Add 'Export Logs' dummy function</li>
- ✨ #29: Impl log exporter - exports the most recent 1000 logs as '.json' file</li>
- ♻️ Refactor the way YoutubeLogs are stored in db. Store 'vid' instead of 'url'</li>

## [Fri - 3/26/21 | PR #18: Add dt/activity edit/delete functionality in ActivityLog](https://github.com/r002/captains-log/pull/18)
- 🧹 Delete '\data\saved_data' from repo</li>
- 🙈 Update .gitignore to exclude local Firestore data that's saved on exit (`/data/saved_data/`)</li>
- ♻️ Refactor code to generate unique Firestore ids on the clientside before writing to Firestore</li>
- 🤡 Add dummy GUI buttons in ActivityLog widget</li>
- ✨ Impl 'delete button' (❌) in ActivityLog widget</li>
- ♻️ Refactor Firestore api calls into /FirestoreApi.ts</li>
- ♻️ Refactor Ticker into its own widget</li>
- ✨ Impl 'double-click-to-edit/update-activity' for ActivityLog</li>
- ♻️ Combine 'updateLog' into 'writeLog' in /FirestoreApi.ts</li>
- 🩹 Round sleep & activity metalog durations to the nearest minute</li>
- 🩹 Round sleep & activity metalog durations to the nearest minute; try again</li>
- ✨ Impl 'double-click-to-edit/update-datetime' for ActivityLog</li>
- 🐞 Impl 'double-click-to-edit/update-datetime' for ActivityLog; fix bug</li>
- ♻️ Refactor 'DtInput' & 'ActivityInput' into their own widgets</li>
- ✨ Impl 'FlashAlert' modal. Invalid DtInput now flashes alert & fails gracefully</li>
- ♻️ Refactor 'sendLogDelete' into `/services/Internal.ts`</li>
- 🐞 Fix 'FlashAlert' bug. Reset every time user signs in/out</li>
