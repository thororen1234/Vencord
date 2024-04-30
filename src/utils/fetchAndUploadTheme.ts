export async function fetchAndUploadTheme(id: string, link: string)
{
    let request = await fetch(link);
    let content = await request.text();
    console.log(content);
    await VencordNative.themes.uploadTheme(id, content);
}