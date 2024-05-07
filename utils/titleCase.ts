export function titleCase(str: string) {
    return str.trim().toLowerCase().split(/_| /).map((word) => {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}
