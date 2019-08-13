# ADC Roundup Hunt 2019

## Git Commands
### Setup
General workflow should involve working in branches on a fork of this project, keeping the fork's `master` branch clean and up to date with the trunk project's `master` branch. The first step will be to configure your local copy with your fork as origin and the trunk as upstream. Once you've created a fork and cloned it, run the following command:

```
git remote -v
```

The result should look something like:

```
origin  https://github.com/[your-username]/adc_roundup_hunt_2019.git (fetch)
origin  https://github.com/[your-username]/adc_roundup_hunt_2019.git (push)
```

Your next step will be to set up the trunk as upstream. You can accomplish this with:


```
git remote set-url upstream https://github.com/jreese42/adc_roundup_hunt_2019.git
```

After which, another `git remote -v` should produce:

```
origin  https://github.com/Toastdeib/adc_roundup_hunt_2019.git (fetch)
origin  https://github.com/Toastdeib/adc_roundup_hunt_2019.git (push)
upstream        https://github.com/jreese42/adc_roundup_hunt_2019.git (fetch)
upstream        https://github.com/jreese42/adc_roundup_hunt_2019.git (push)
```

If that's what you see, you're all set!

### Workflow
All work should be done on local branches, keeping `master` clean. To create a new branch, use:

```
git checkout -b [branch-name]
```

Once a branch is created, you can switch between existing ones with the same command, just minus the `-b` flag. When you're done with your work on a branch, you can open a pull request on github's webpage to merge your branch back into `trunk/master` (it should be the default location).

In order to keep your own fork's `master` branch up to date with trunk, you should periodically fetch the latest from upstream and rebase. The commands to accomplish this are:

```
git fetch upstream         //Grabs the latest from your upstream remote
git rebase upstream/master //Rebases your active local branch on upstream/master - make sure to only do this on your own local master branch
git push                   //Pushes the changes to your fork
```

You can also see how far behind your own fork is from trunk on github's webpage - it'll either tell you that your fork is even with trunk or that you're behind, in which case it mentions how many commits behind you are.
