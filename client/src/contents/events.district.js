// councilData.js - Council Members Data

export const councilMembers = [
    // Main Leader (Top Row - 1 person)
    {
        id: 1,
        name: "Gurukul",
        position: "Click to know more",
        // image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        // bio: "Experienced leader in operations management and team coordination.",
        // email: "michael.chen@council.org",
        // phone: "+1 (555) 234-5678",
        tier: "sub-main2",
    },
    {
        id: 2,
        name: "⁠SHOR and Ashwamedh",
        position: "Click to know more",
        // image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        // bio: "Experienced leader in operations management and team coordination.",
        // email: "michael.chen@council.org",
        // phone: "+1 (555) 234-5678",
        tier: "sub-main2",
    },
    {
        id: 3,
        name: "Trek",
        position: "Click to know more",
        // image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        // bio: "Expert in administrative affairs and organizational governance.",
        // email: "emily.rodriguez@council.org",
        // phone: "+1 (555) 345-6789",
        tier: "sub-main2",
    },

    {
        id: 4,
        name: "Rota League",
        position: "Click to know more",
        // image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        // bio: "Experienced leader in operations management and team coordination.",
        // email: "michael.chen@council.org",
        // phone: "+1 (555) 234-5678",
        tier: "sub-main2",
    },
    {
        id: 5,
        name: "Rota Fiesta",
        position: "Click to know more",
        // image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        // bio: "Experienced leader in operations management and team coordination.",
        // email: "michael.chen@council.org",
        // phone: "+1 (555) 234-5678",
        tier: "sub-main2",
    },
    {
        id: 6,
        name: "⁠54th District Conference",
        position: "Click to know more",
        // image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        // bio: "Expert in administrative affairs and organizational governance.",
        // email: "emily.rodriguez@council.org",
        // phone: "+1 (555) 345-6789",
        tier: "sub-main2",
    },
];

// Helper function to get members by tier
export const getMembersByTier = (tier) => {
    return councilMembers.filter((member) => member.tier === tier);
};

// Helper function to get all tiers
export const getTiers = () => {
    return ["main", "sub-main", "sub-main2", "member", "dro"];
};
