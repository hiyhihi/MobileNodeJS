import {
  getTimeContext,
  calcRecencyFactor
} from "../utils/recommend.helper.js";

export const calculateScore = (post, user, preferredDifficulty) => {
    let score = 0;

    if (user.fav.some(f => f._id.equals(post._id))) {
        score += 5;
    }

    const viewed = user.viewedPosts.find(v =>
        v.post._id.equals(post._id)
    );
    if (viewed) score += 4;

    if (viewed) {
        score *= calcRecencyFactor(viewed.viewedAt);
    }

    if (viewed && viewed.count > 3) {
        score -= 6;
    }

    if (post.doKho === preferredDifficulty) {
        score += 5;
    }

    if (
        user.ignoredPosts?.some(i =>
            i.post.equals(post._id)
        )
    ) {
        score -= 5;
    }

    const time = getTimeContext();
    if (time === "sang") score += 3;
    if (time === "toi" && post.doKho !== "de") score += 3;

    score += Math.min(post.views / 20, 3);
    score += Math.min(post.luotThich / 10, 3);

    return score;
};
