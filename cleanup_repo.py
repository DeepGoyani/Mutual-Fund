#!/usr/bin/env python3
"""
Cleanup script to remove commit files from GitHub repository
"""

import os
import subprocess
import glob

def run_command(command, cwd=None):
    """Run a command and return output"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def main():
    print("🧹 Starting cleanup script...")
    
    cwd = os.getcwd()
    
    # Remove all commit_*.txt files
    print("🗑️ Removing commit files...")
    commit_files = glob.glob("commit_*.txt")
    for file in commit_files:
        try:
            os.remove(file)
            print(f"✅ Removed {file}")
        except Exception as e:
            print(f"❌ Failed to remove {file}: {e}")
    
    # Remove temp_commit.txt if exists
    if os.path.exists("temp_commit.txt"):
        try:
            os.remove("temp_commit.txt")
            print("✅ Removed temp_commit.txt")
        except Exception as e:
            print(f"❌ Failed to remove temp_commit.txt: {e}")
    
    # Stage the deletions
    print("📝 Staging file deletions...")
    run_command("git add -A", cwd)
    
    # Commit the cleanup
    print("💾 Committing cleanup...")
    success, _, _ = run_command('git commit -m "chore: remove temporary commit files and clean repository"', cwd)
    
    if success:
        print("✅ Cleanup commit successful")
    else:
        print("ℹ️ No changes to commit")
    
    # Force push to clean up remote
    print("📤 Force pushing cleaned repository to GitHub...")
    success, stdout, stderr = run_command("git push origin main --force", cwd)
    
    if success:
        print("✅ Successfully pushed cleaned repository to GitHub!")
    else:
        print(f"❌ Push failed: {stderr}")
        print("🔧 You may need to manually run: git push origin main --force")
    
    # Show current status
    print("\n📊 Current repository status:")
    success, stdout, stderr = run_command("git status", cwd)
    if success:
        print(stdout)
    
    # Show commit count
    success, stdout, stderr = run_command("git rev-list --count HEAD", cwd)
    if success:
        print(f"📈 Total commits: {stdout.strip()}")
    
    print("\n🎉 Cleanup completed!")
    print("🌐 Repository: https://github.com/DeepGoyani/Mutual-Fund")

if __name__ == "__main__":
    main()
