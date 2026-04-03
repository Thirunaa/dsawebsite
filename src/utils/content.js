export const isExternalUrl = (value = "") => /^https?:\/\//i.test(value);

export const resolveResourceLink = (value = "") => {
  if (!value) {
    return "";
  }

  if (isExternalUrl(value)) {
    return value;
  }

  try {
    return require(`../data/${value}`);
  } catch (error) {
    return value;
  }
};

export const getYouTubeId = (url = "") => {
  if (!url) {
    return "";
  }

  const patterns = [
    /youtu\.be\/([^?&/]+)/i,
    /youtube\.com\/watch\?v=([^?&/]+)/i,
    /youtube\.com\/embed\/([^?&/]+)/i,
    /youtube\.com\/shorts\/([^?&/]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return "";
};

export const getYouTubeThumbnailSet = (url = "") => {
  const videoId = getYouTubeId(url);

  if (!videoId) {
    return [];
  }

  return [
    `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`,
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi_webp/${videoId}/hq720.webp`,
    `https://i.ytimg.com/vi/${videoId}/hq720.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  ];
};
