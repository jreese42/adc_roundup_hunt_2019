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

# API
## User Management

---
### Fetch User
**URL** : `/api/user/<user>`

**Method** : `GET`

**URL Parameters**  
    `<user>` may be either an attendee Id or `me` to select the current session user.

**Details**  
    This command fetches user data.  If the user does not exist, it is created using the supplied attendeeId and the first/last names from the active session.  To make a user with a sepcified name and ID, see `Create User`.

---    
### Check User Exists

**URL** : `/api/user/<user>/exists`

**Method** : `GET`

**URL Parameters**  
    `<user>` may be either an attendee Id or `me` to select the current session user.
    
**Response**  
    `true` or `false`

**Details**  
    Fetch a boolean value indicating if a user record exists.

---
### Create User

**URL** : `/api/user/<user>/create?firstName=<firstName>&lastName=<lastName>`

**Method** : `POST`

**Requires Authentication** : Yes

**URL Parameters**  
    `<user>` may be either an attendee Id or `me` to select the current session user.  
    `<firstName>` The user's first name for the new user record.  
    `<lastName>` The user's last name for the new user record.  
    
**Response**  
    `true` if a new user was created, else `false`.  

**Details**  
    Only the attendeeId, firstName, and lastName parameters are set in the new user.  The rest of the options have default values, including the displayNameFormat parameter, until manually set.

---
### Delete User

**URL** : `/api/user/<user>/delete`

**Method** : `POST`

**Requires Authentication** : Yes

**URL Parameters**  
    `<user>` may be either an attendee Id or `me` to select the current session user.
    
**Response**  
    `true` if the user existed and was deleted, else `false`.

**Details**  
    Delete a user record if it exists.

---
### Get Name

**URL** : `/api/user/<user>/name`

**Method** : `GET`

**URL Parameters**  
    `<user>` may be either an attendee Id or `me` to select the current session user.
    
**Response**  
    The user's name encoded using the user's display name format.

**Details**  
    The user's name will be either their First Name/Last Name, First Initial/Last Name, "Anonymous", or a Custom option if set.

---
### Set Name

**URL** : `/api/user/<user>/name`

**Method** : `POST`

**Requires Authentication** : Yes

**URL Parameters**  
    `<user>` may be either an attendee Id or `me` to select the current session user.

**POST Parameters**  
    `name` The new name for the user
    
**Response**  
    `true` if the new name was set, else `false`

**Details**  
    This sets a custom name for a user record.  Inherently, this also set the displayName option to 'Custom'.

---
### Set Display Name Format

**URL** : `/api/user/<user>/displayNameFormat`

**Method** : `POST`

**Requires Authentication** : Yes, except when using `me`

**URL Parameters**  
    `<user>` may be either an attendee Id or `me` to select the current session user.

**POST Parameters**  
    `displayNameFormat` A string, one of `FirstNameLastName`, `FirstInitialLastName`, `Anonymous`, or `Unknown`
    
**Response**  
    `true` if the new format was set, else `false`

**Details**  
    Set the display name format for a user.

---

### Submit Password

**URL** : `/api/user/<user>/submitPassword`

**Method** : `POST`

**Requires Authentication** : Yes, except when using `me`

**URL Parameters**  
    `<user>` may be either an attendee Id or `me` to select the current session user.

**POST Parameters**  
    `solutionId` A number indicating which puzzle number to check  
    `password` A string, the password being submitted  
    
**Response**  
    `true` if the password was correct, else `false`

**Details**  
    Check a password for a puzzle.  If the password is correct, it is also updated in the user record.

---

### Fetch Leaderboard

**URL** : `/api/leaderboard?page=<page>`

**Method** : `POST`

**URL Parameters**  
    `<user>` may be either an attendee Id or `me` to select the current session user.
    `<page>` the page being requested.  Pages are 25 entries each.
    
**Response**  
    JSON Object containing:
    `leaderboardData` an array containing 25 entries of the leaderboard. And entry has an `index`, `name`, `score`, and `isCurrentUser`.

**Details**  
    Fetch leaderboard data.  The client is responsible for handling the paging/max pages (this is NOT RESTful because it does not respond with the pageCount!)

---

## Blog Post Management

---
### Create New Blog Post

**URL** : `/api/blog/createNew`

**Method** : `POST`

**Requires Authentication** : Yes

**POST Parameters**  
    `title` The post title  
    `subtitle` The post subtitle  
    `author` The post's author  
    `dateStr` A string shown for the post's date, e.g. `September 27, 2019`  
    `timeStr` A string shown for the post's time, e.g. `12:00 am`  
    `imagePath` An absolute path to the header image for the post, e.g. `/img/puppy.jpg`  
    `releaseTime` A datetime string when the blog will be posted in format `yyyy-mm-ddThh:mm:ss.000Z`  
    `text` The full text of the new blog post  
    
**Response**  
    The new blog record as JSON.

**Details**  
    Create a new blog record.

---
### Fetch Blog Post

**URL** : `/api/blog/<blogId>`

**Method** : `GET`

**Requires Authentication** : Yes

**URL Parameters**  
    `<blogId>` The ID of the blog to fetch
    
**Response**  
    A blog record as JSON, or an empty response if not found.

**Details**  
    Fetch a blog record

---
### Update Blog Post

**URL** : `/api/blog/<blogId>`

**Method** : `POST`

**Requires Authentication** : Yes

**URL Parameters**  
    `<blogId>` The ID of the blog to update

**POST Parameters**  
    `title` The post title. Optional.  
    `subtitle` The post subtitle. Optional.  
    `author` The post's author. Optional.  
    `dateStr` A string shown for the post's date, e.g. `September 27, 2019`. Optional.  
    `timeStr` A string shown for the post's time, e.g. `12:00 am`. Optional.  
    `imagePath` An absolute path to the header image for the post, e.g. `/img/puppy.jpg`. Optional.  
    `releaseTime` A datetime string when the blog will be posted in format `yyyy-mm-ddThh:mm:ss.000Z`. Optional.  
    `text` The full text of the new blog post. Optional.  
    
**Response**  
    `true` if the blog post was updated successfully, else `false`

**Details**  
    Update a blog record

---
### Delete Blog Post

**URL** : `/api/blog/<blogId>/delete`

**Method** : `POST`

**Requires Authentication** : Yes

**URL Parameters**  
    `<blogId>` The ID of the blog to delete
    
**Response**  
    `true` if the post was deleted, else `false`

**Details**  
    Delete a blog record

---