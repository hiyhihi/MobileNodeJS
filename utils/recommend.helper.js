export const getTimeContext = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return "sang";
    if (hour >= 10 && hour < 14) return "trua";
    if (hour >= 17 && hour < 21) return "toi";
    return "dem";
};

export const getPreferredDifficulty = (viewedPosts = []) => {
    const count = { de: 0, "trung-binh": 0, kho: 0 };

    viewedPosts.forEach(v => {
        if (v.post?.doKho) {
          count[v.post.doKho]++;
        }
    });

    return Object.keys(count).reduce((a, b) =>
        count[a] > count[b] ? a : b
    );
};

export const calcRecencyFactor = (viewedAt) => {
    if (!viewedAt) return 1;
    const daysAgo = (Date.now() - new Date(viewedAt)) / (1000 * 60 * 60 * 24);
    return Math.max(1.5 - daysAgo * 0.1, 1);
};
