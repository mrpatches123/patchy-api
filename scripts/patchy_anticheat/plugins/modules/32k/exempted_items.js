export const exemptedItems = {
    'minecraft:trident': 1,
    'minecraft:diamond_sword': 2,
    'minecraft:netherite_axe': 2,
    'minecraft:netherite_sword': 3,
    'minecraft:bow': 16
    // 'minecraft:crossbow': undefined,
};


export const maxEnchantmentsPerItems = [
    {
        items: [
            'minecraft:chain_helmet',
            'minecraft:chain_chestplate',
            'minecraft:chain_leggings',
            'minecraft:chain_boots',

        ],
        enchants: {
            protection: 6,
            thorns: 2,
            unbreaking: 3,
            mending: 1
        }
    },
    {
        items: [
            'minecraft:iron_helmet',
            'minecraft:iron_chestplate',
            'minecraft:iron_leggings',
            'minecraft:iron_boots',

        ],
        enchants: {
            protection: 13,
            thorns: 5,
            unbreaking: 7,
            mending: 3
        }
    },
    {
        items: [
            'minecraft:diamond_helmet',
            'minecraft:diamond_chestplate',
            'minecraft:diamond_leggings',
            'minecraft:diamond_boots',

        ],
        enchants: {
            protection: 21,
            thorns: 5,
            unbreaking: 12,
            mending: 5
        }
    },
    {
        items: [
            'minecraft:netherite_helmet',
            'minecraft:netherite_chestplate',
            'minecraft:netherite_leggings',
            'minecraft:netherite_boots',

        ],
        enchants: {
            protection: 25,
            thorns: 5,
            unbreaking: 15,
            mending: 6
        }
    }
]