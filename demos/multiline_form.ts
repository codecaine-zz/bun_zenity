import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  const result = await zenity.forms(
    [
      { type: 'entry', label: 'Post Title' },
      { type: 'multiline', label: 'Content' },
      { type: 'entry', label: 'Tags (comma-separated)' }
    ],
    {
      title: "Create Blog Post",
      text: "Write your blog post below:",
      separator: "||",
      width: 600,
      height: 800
    }
  );

  if (result.button === 'ok' && result.values) {
    const [title, content, tags] = result.values;

    // Validation
    if (!title || !content) {
      console.error("✗ Error: Title and content are required");
      process.exit(1);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✓ BLOG POST CREATED");
    console.log("=".repeat(60));
    console.log(`\nTitle: ${title}`);
    console.log(`\nContent:\n${content}`);
    console.log(`\nTags: ${tags}`);
    console.log("\n" + "=".repeat(60));
    process.exit(0);
  } else if (result.button === 'cancel') {
    console.log("✗ Post creation cancelled");
    process.exit(1);
  } else {
    console.error("✗ No data received");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
