# Captain's Log
*"Bring explicit intentionality into your life."* \
Started: Thu - 3/18/21

npm init \
npm install eslint --save-dev \
npx eslint --init

### Set up an `upstream` remote.
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git

### Reset my fork to be up-to-date with original repo.
git reset --hard upstream/master

### To hard-pull from HEAD and overwrite all local files.
git fetch \
git reset --hard origin/main \
git reset --hard upstream/master

### Git commands
git log origin/main..HEAD \
git remote -v

### Firebase Commands
firebase emulators:start --only "auth,firestore" --import=data\multi-users --export-on-exit=data\saved_data \
firebase emulators:start --only hosting \
firebase deploy --only hosting \
firebase deploy --only functions \
firebase emulators:export data\multi-users

- https://stackoverflow.com/questions/1125968/how-do-i-force-git-pull-to-overwrite-local-files
- https://stackoverflow.com/questions/39632667/how-do-i-kill-the-process-currently-using-a-port-on-localhost-in-windows
- https://stackoverflow.com/questions/65586212/how-to-shutdown-firebase-emulator-properly-on-windows-10

```shell
$> netstat -ano | findstr :8080
$> taskkill /PID <PID> /F
$> dir env:
```

### Misc Links
- https://mariusschulz.com/blog/declaring-global-variables-in-typescript
- https://stackoverflow.com/questions/52100103/getting-all-documents-from-one-collection-in-firestore
- https://medium.com/firebase-developers/the-secrets-of-firestore-fieldvalue-servertimestamp-revealed-29dd7a38a82b
- https://gitmoji.dev/

---

## Project Motivation
Several motivations inspired and drove this project.

First: I've always been a big fan of the "self-quantification movement." I own a Fitbit and enjoy seeing granular metrics on everything I do: Sleep, exercise, etc. But Fitbit alone was insufficient. I wanted to know how much time I spent eating, brushing my teeth, running errands, etc.

Second: I wanted a good project with which to learn React with hooks and what webdev looks like nowadays in 2021. Webpack, ESLint, TypeScript, Firebase preview channels, the whole nine yards. My previous knowledge on the webdev front was horribly outdated. Also: Tests, design patterns, Git. It was high time to get caught up.

Finally, realistically though, what ***really*** drove this project: My wife, honest to God, bugs me probably once a week that "I don't spend enough time with her." And that: "I love my computer and spend more time with it than I love her."  Utter baloney.  With this app, I now finally have hard, cold data to show The Wife that, "See? We *did* visit the park four times last week!" and "I spent an aggregate total of __ hours __ minutes with you last month watching Netflix, going out for walks, and eating."

Data and technology to the rescue! 😀