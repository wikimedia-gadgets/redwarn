function serialize(data) {
    return btoa(encodeURIComponent(data));
}

function deserialize(data) {
    return decodeURIComponent(atob(data));
}