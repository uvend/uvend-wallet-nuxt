# OneDrive Workaround for .nuxt Directory

## Problem
OneDrive can cause EPERM (operation not permitted) errors when trying to delete or modify files in the `.nuxt` directory. This happens because OneDrive tries to sync the build output directory.

## Solution

### Quick Fix (Run the Script)
Run the PowerShell script to automatically handle the issue:

```powershell
.\fix-onedrive.ps1
```

### Manual Fix

1. **Exclude .nuxt from OneDrive Sync:**
   - Right-click the OneDrive icon in your system tray
   - Go to **Settings** > **Sync and backup** > **Advanced settings**
   - Click **Choose folders** or **Exclude folders**
   - Add `.nuxt` to the exclusion list

2. **Alternative: Use .onedriveignore**
   - The script creates a `.onedriveignore` file in the `.nuxt` directory
   - This tells OneDrive to ignore the directory

3. **If .nuxt/dev is locked:**
   - Close your IDE/development server
   - Run the fix script again
   - Or manually delete `.nuxt/dev` folder after closing all processes

## Prevention

The `.nuxt` directory is already in `.gitignore`, so it won't be committed to git. However, OneDrive may still try to sync it if your project folder is in a OneDrive location.

### Best Practice
Consider moving your development projects outside of OneDrive sync folders, or use OneDrive's exclusion feature to prevent syncing build directories.

## Notes

- The `.nuxt` directory is a build cache and can be safely deleted
- It will be regenerated on the next `npm run dev` or build command
- If you encounter persistent issues, restart your IDE and development server

