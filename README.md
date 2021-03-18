# Captain's Log
Started: Thu - 3/18/21

npm init \
npm install eslint --save-dev \
npx eslint --init

### Set up an `upstream` remote.
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git

# Reset my fork to be up-to-date with original repo.
git reset --hard upstream/master

### To hard-pull from HEAD and overwrite all local files.
git fetch
git reset --hard origin/main
git reset --hard upstream/master

### Git commands
git log origin/main..HEAD \
git remote -v

### Firebase Commands
firebase emulators:start --only "auth,firestore" --import=data\base_example --export-on-exit=data\saved_data \
firebase emulators:start --only hosting \
firebase deploy --only hosting \
firebase emulators:export data\2021-03-18

https://stackoverflow.com/questions/1125968/how-do-i-force-git-pull-to-overwrite-local-files
https://stackoverflow.com/questions/39632667/how-do-i-kill-the-process-currently-using-a-port-on-localhost-in-windows
https://stackoverflow.com/questions/65586212/how-to-shutdown-firebase-emulator-properly-on-windows-10
```shell
$> netstat -ano | findstr :8080
$> taskkill /PID <PID> /F
```

### Misc Links
- https://mariusschulz.com/blog/declaring-global-variables-in-typescript
- https://stackoverflow.com/questions/52100103/getting-all-documents-from-one-collection-in-firestore
- https://medium.com/firebase-developers/the-secrets-of-firestore-fieldvalue-servertimestamp-revealed-29dd7a38a82b