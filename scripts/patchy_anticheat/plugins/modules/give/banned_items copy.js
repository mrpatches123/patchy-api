
const bannedItems = [
    //unibaleble vanvilla blocks////////////////////////////////////////////////////////
    {
        id: 'minecraft:fire',
        response: 3
    },
    {
        id: 'minecraft:soul_fire',
        response: 3
    },
    {
        id: 'minecraft:trip_wire',
        response: 3
    },
    {
        id: 'minecraft:tripwire',
        response: 3
    },
    {
        id: 'minecraft:flowing_water',
        response: 3
    },
    {
        id: 'minecraft:water',
        response: 3
    },
    {
        id: 'minecraft:lava',
        response: 3
    },
    {
        id: 'minecraft:end_gateway',
        response: 3
    },
    {
        id: 'minecraft:end_portal',
        response: 3
    },
    {
        id: 'minecraft:unlit_redstone_torch',
        response: 3
    },
    {
        id: 'minecraft:lit_redstone_torch',
        response: 3
    },
    {
        id: 'minecraft:end_portal_frame',
        response: 3
    },
    {
        id: 'minecraft:wall_sign',
        response: 3
    },
    {
        id: 'minecraft:redstone_wire',
        response: 3
    },
    {
        id: 'minecraft:netherreactor',
        response: 3
    },
    {
        id: 'minecraft:info_update',
        response: 3
    },
    {
        id: 'minecraft:movingblock',
        response: 3
    },
    {
        id: 'minecraft:bubble_column',
        response: 3
    },
    {
        id: 'minecraft:pistonarmcolision',
        response: 3
    },
    {
        id: 'minecraft:jigsaw',
        response: 3
    },
    {
        id: 'minecraft:glowingobsidian',
        response: 3
    },
    {
        id: 'minecraft:invisiblebedrock',
        response: 3
    },
    {
        id: 'minecraft:bedrock',
        response: 1
    },
    {
        id: 'minecraft:stonecutter',
        response: 3
    },
    {
        id: 'minecraft:infor_update2',
        response: 3
    },
    {
        id: 'minecraft:stonecutter',
        response: 3
    },
    {
        id: 'minecraft:command_block',
        response: 3
    },
    {
        id: 'minecraft:repeating_command_block',
        response: 3
    },
    {
        id: 'minecraft:chain_command_block',
        response: 3
    },
    {
        id: 'minecraft:light_block',
        response: 3
    },
    {
        id: 'minecraft:beehive',
        response: 3
    },
    {
        id: 'minecraft:bee_nest',
        response: 3
    },
    {
        id: 'minecraft:item.chain',
        response: 3
    },
    {
        id: 'minecraft:brewingstandblock',
        response: 3
    },
    {
        id: 'minecraft:lit_redstone_lamp',
        response: 3
    },
    {
        id: 'minecraft:item.iron_door',
        response: 3
    },
    {
        id: 'minecraft:item.cake',
        response: 3
    },
    {
        id: 'minecraft:structure_void',
        response: 3
    },
    {
        id: 'minecraft:item.cake',
        response: 3
    },
    {
        id: 'minecraft:barrier',
        response: 3
    },
    {
        id: 'minecraft:double_stone_slab',
        response: 3
    },
    {
        id: 'minecraft:double_wooden_slab',
        response: 3
    },
    {
        id: 'minecraft:lit_furnace',
        response: 3
    },
    {
        id: 'minecraft:item.frame',
        response: 3
    },
    {
        id: 'minecraft:item.kelp',
        response: 3
    },
    {
        id: 'minecraft:item.cauldron',
        response: 3
    },
    {
        id: 'minecraft:darkoak_standing_sign',
        response: 3
    },
    {
        id: 'minecraft:darkoak_wall_sign',
        response: 3
    },
    {
        id: 'minecraft:acacia_standing_sign',
        response: 3
    },
    {
        id: 'minecraft:acacia_wall_sign',
        response: 3
    },
    {
        id: 'minecraft:jungle_standing_sign',
        response: 3
    },
    {
        id: 'minecraft:jungle_wall_sign',
        response: 3
    },
    {
        id: 'minecraft:spruce_standing_sign',
        response: 3
    },
    {
        id: 'minecraft:spruce_wall_sign',
        response: 3
    },
    {
        id: 'minecraft:birch_standing_sign',
        response: 3
    },
    {
        id: 'minecraft:birch_wall_sign',
        response: 3
    },
    {
        id: 'minecraft:warped_standing_sign',
        response: 3
    },
    {
        id: 'minecraft:warped_wall_sign',
        response: 3
    },
    {
        id: 'minecraft:crimson_standing_sign',
        response: 3
    },
    {
        id: 'minecraft:crimson_wall_sign',
        response: 3
    },
    {
        id: 'minecraft:item.warped_door',
        response: 3
    },
    {
        id: 'minecraft:item.crimson_door',
        response: 3
    },
    {
        id: 'minecraft:item.dark_oak_door',
        response: 3
    },
    {
        id: 'minecraft:item.birch_door',
        response: 3
    },
    {
        id: 'minecraft:item.jungle_door',
        response: 3
    },
    {
        id: 'minecraft:item.acacia_door',
        response: 3
    },
    {
        id: 'minecraft:item.spruce_door',
        response: 3
    },
    {
        id: 'minecraft:item.wooden_door',
        response: 3
    },
    {
        id: 'minecraft:item.bed',
        response: 3
    },
    {
        id: 'minecraft:melon_stem',
        response: 3
    },
    {
        id: 'minecraft:pumkin_stem',
        response: 3
    },
    {
        id: 'minecraft:real_stone_slab',
        response: 3
    },
    {
        id: 'minecraft:powered_comparator',
        response: 3
    },
    {
        id: 'minecraft:powered_repeator',
        response: 3
    },
    {
        id: 'minecraft:wall_banner',
        response: 3
    },
    {
        id: 'minecraft:unpowered_comparator',
        response: 3
    },
    {
        id: 'minecraft:unpowered_repeator',
        response: 3
    },
    {
        id: 'minecraft:colored_torch_rg',
        response: 3
    },
    {
        id: 'minecraft:colored_torch_bp',
        response: 3
    },
    {
        id: 'minecraft:item.wheat',
        response: 3
    },
    {
        id: 'minecraft:item.reeds',
        response: 3
    },
    {
        id: 'minecraft:item.beetroot',
        response: 3
    },
    {
        id: 'minecraft:item.hopper',
        response: 3
    },
    {
        id: 'minecraft:unknown',
        response: 3
    },
    {
        id: 'minecraft:deny',
        response: 3
    },
    {
        id: 'minecraft:allow',
        response: 3
    },
    {
        id: 'minecraft:border',
        response: 3
    },
    {
        id: 'minecraft:border_block',
        response: 3
    },
    {
        id: 'minecraft:item.flower_pot',
        response: 3
    },
    {
        id: 'minecraft:item.structure_void',
        response: 3
    },
    {
        id: 'minecraft:frosted_ice',
        response: 3
    },
    {
        id: 'minecraft:frosted_ice',
        response: 3
    },
    {
        id: 'minecraft:item.wart',
        response: 3
    },
    {
        id: 'minecraft:hard_glass',
        response: 3
    },
    {
        id: 'minecraft:camera',
        response: 3
    },
    {
        id: 'minecraft:item.camera',
        response: 3
    },
    {
        id: 'minecraft:portal',
        response: 3
    },

    //EDU////////////////////////////////////////////////////////

    {
        id: 'minecraft:glow_stick',
        response: 3
    },
    {
        id: 'minecraft:chemical_heat',
        response: 3
    },
    {
        id: 'minecraft:compound',
        response: 3
    },
    {
        id: 'minecraft:balloon',
        response: 3
    },
    {
        id: 'minecraft:ice_bomb',
        response: 3
    },
    {
        id: 'minecraft:super_fertilizer',
        response: 3
    },
    {
        id: 'minecraft:colored_torch',
        response: 3
    },
    {
        id: 'minecraft:sparklers',
        response: 3
    },
    {
        id: 'minecraft:underwater_tnt',
        response: 3
    },
    {
        id: 'minecraft:underwater_torch',
        response: 3
    },
    {
        id: 'minecraft:medicine',
        response: 3
    },
    {
        id: 'minecraft:chemistry_table',
        response: 3
    },
    {
        id: 'minecraft:element_0',
        response: 3
    },
    {
        id: 'minecraft:element_1',
        response: 3
    },
    {
        id: 'minecraft:element_2',
        response: 3
    },
    {
        id: 'minecraft:element_3',
        response: 3
    },
    {
        id: 'minecraft:element_4',
        response: 3
    },
    {
        id: 'minecraft:element_5',
        response: 3
    },
    {
        id: 'minecraft:element_6',
        response: 3
    },
    {
        id: 'minecraft:element_7',
        response: 3
    },
    {
        id: 'minecraft:element_8',
        response: 3
    },
    {
        id: 'minecraft:element_9',
        response: 3
    },
    {
        id: 'minecraft:element_10',
        response: 3
    },
    {
        id: 'minecraft:element_11',
        response: 3
    },
    {
        id: 'minecraft:element_12',
        response: 3
    },
    {
        id: 'minecraft:element_13',
        response: 3
    },
    {
        id: 'minecraft:element_14',
        response: 3
    },
    {
        id: 'minecraft:element_15',
        response: 3
    },
    {
        id: 'minecraft:element_16',
        response: 3
    },
    {
        id: 'minecraft:element_17',
        response: 3
    },
    {
        id: 'minecraft:element_18',
        response: 3
    },
    {
        id: 'minecraft:element_19',
        response: 3
    },
    {
        id: 'minecraft:element_20',
        response: 3
    },
    {
        id: 'minecraft:element_21',
        response: 3
    },
    {
        id: 'minecraft:element_22',
        response: 3
    },
    {
        id: 'minecraft:element_23',
        response: 3
    },
    {
        id: 'minecraft:element_24',
        response: 3
    },
    {
        id: 'minecraft:element_25',
        response: 3
    },
    {
        id: 'minecraft:element_26',
        response: 3
    },
    {
        id: 'minecraft:element_27',
        response: 3
    },
    {
        id: 'minecraft:element_28',
        response: 3
    },
    {
        id: 'minecraft:element_29',
        response: 3
    },
    {
        id: 'minecraft:element_30',
        response: 3
    },
    {
        id: 'minecraft:element_31',
        response: 3
    },
    {
        id: 'minecraft:element_32',
        response: 3
    },
    {
        id: 'minecraft:element_33',
        response: 3
    },
    {
        id: 'minecraft:element_34',
        response: 3
    },
    {
        id: 'minecraft:element_35',
        response: 3
    },
    {
        id: 'minecraft:element_36',
        response: 3
    },
    {
        id: 'minecraft:element_37',
        response: 3
    },
    {
        id: 'minecraft:element_38',
        response: 3
    },
    {
        id: 'minecraft:element_39',
        response: 3
    },
    {
        id: 'minecraft:element_40',
        response: 3
    },
    {
        id: 'minecraft:element_41',
        response: 3
    },
    {
        id: 'minecraft:element_42',
        response: 3
    },
    {
        id: 'minecraft:element_43',
        response: 3
    },
    {
        id: 'minecraft:element_44',
        response: 3
    },
    {
        id: 'minecraft:element_45',
        response: 3
    },
    {
        id: 'minecraft:element_46',
        response: 3
    },
    {
        id: 'minecraft:element_47',
        response: 3
    },
    {
        id: 'minecraft:element_48',
        response: 3
    },
    {
        id: 'minecraft:element_49',
        response: 3
    },
    {
        id: 'minecraft:element_50',
        response: 3
    },
    {
        id: 'minecraft:element_51',
        response: 3
    },
    {
        id: 'minecraft:element_52',
        response: 3
    },
    {
        id: 'minecraft:element_53',
        response: 3
    },
    {
        id: 'minecraft:element_54',
        response: 3
    },
    {
        id: 'minecraft:element_55',
        response: 3
    },
    {
        id: 'minecraft:element_56',
        response: 3
    },
    {
        id: 'minecraft:element_57',
        response: 3
    },
    {
        id: 'minecraft:element_58',
        response: 3
    },
    {
        id: 'minecraft:element_59',
        response: 3
    },
    {
        id: 'minecraft:element_60',
        response: 3
    },
    {
        id: 'minecraft:element_61',
        response: 3
    },
    {
        id: 'minecraft:element_62',
        response: 3
    },
    {
        id: 'minecraft:element_63',
        response: 3
    },
    {
        id: 'minecraft:element_64',
        response: 3
    },
    {
        id: 'minecraft:element_65',
        response: 3
    },
    {
        id: 'minecraft:element_66',
        response: 3
    },
    {
        id: 'minecraft:element_67',
        response: 3
    },
    {
        id: 'minecraft:element_68',
        response: 3
    },
    {
        id: 'minecraft:element_69',
        response: 3
    },
    {
        id: 'minecraft:element_70',
        response: 3
    },
    {
        id: 'minecraft:element_71',
        response: 3
    },
    {
        id: 'minecraft:element_72',
        response: 3
    },
    {
        id: 'minecraft:element_73',
        response: 3
    },
    {
        id: 'minecraft:element_74',
        response: 3
    },
    {
        id: 'minecraft:element_75',
        response: 3
    },
    {
        id: 'minecraft:element_76',
        response: 3
    },
    {
        id: 'minecraft:element_77',
        response: 3
    },
    {
        id: 'minecraft:element_78',
        response: 3
    },
    {
        id: 'minecraft:element_79',
        response: 3
    },
    {
        id: 'minecraft:element_80',
        response: 3
    },
    {
        id: 'minecraft:element_81',
        response: 3
    },
    {
        id: 'minecraft:element_82',
        response: 3
    },
    {
        id: 'minecraft:element_83',
        response: 3
    },
    {
        id: 'minecraft:element_84',
        response: 3
    },
    {
        id: 'minecraft:element_85',
        response: 3
    },
    {
        id: 'minecraft:element_86',
        response: 3
    },
    {
        id: 'minecraft:element_87',
        response: 3
    },
    {
        id: 'minecraft:element_88',
        response: 3
    },
    {
        id: 'minecraft:element_89',
        response: 3
    },
    {
        id: 'minecraft:element_90',
        response: 3
    },
    {
        id: 'minecraft:element_91',
        response: 3
    },
    {
        id: 'minecraft:element_92',
        response: 3
    },
    {
        id: 'minecraft:element_93',
        response: 3
    },
    {
        id: 'minecraft:element_94',
        response: 3
    },
    {
        id: 'minecraft:element_95',
        response: 3
    },
    {
        id: 'minecraft:element_96',
        response: 3
    },
    {
        id: 'minecraft:element_97',
        response: 3
    },
    {
        id: 'minecraft:element_98',
        response: 3
    },
    {
        id: 'minecraft:element_99',
        response: 3
    },
    {
        id: 'minecraft:element_100',
        response: 3
    },
    {
        id: 'minecraft:element_101',
        response: 3
    },
    {
        id: 'minecraft:element_102',
        response: 3
    },
    {
        id: 'minecraft:element_103',
        response: 3
    },
    {
        id: 'minecraft:element_104',
        response: 3
    },
    {
        id: 'minecraft:element_105',
        response: 3
    },
    {
        id: 'minecraft:element_106',
        response: 3
    },
    {
        id: 'minecraft:element_107',
        response: 3
    },
    {
        id: 'minecraft:element_108',
        response: 3
    },
    {
        id: 'minecraft:element_109',
        response: 3
    },
    {
        id: 'minecraft:element_110',
        response: 3
    },
    {
        id: 'minecraft:element_111',
        response: 3
    },
    {
        id: 'minecraft:element_112',
        response: 3
    },
    {
        id: 'minecraft:element_113',
        response: 3
    },
    {
        id: 'minecraft:element_114',
        response: 3
    },
    {
        id: 'minecraft:element_115',
        response: 3
    },
    {
        id: 'minecraft:element_116',
        response: 3
    },
    {
        id: 'minecraft:element_117',
        response: 3
    },
    {
        id: 'minecraft:element_118',
        response: 3

    //spawn eggs////////////////////////////////////////////////////////
    },
    {
        id: 'minecraft:spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:agent_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:axolotl_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:bat_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:bee_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:blaze_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:cat_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:cave_spider_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:chicken_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:cod_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:cow_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:creeper_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:dolphin_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:donkey_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:drowned_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:elder_guardian_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:enderman_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:endermite_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:evoker_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:fox_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:ghast_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:glow_squid_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:goat_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:guardian_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:hoglin_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:horse_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:husk_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:llama_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:magma_cube_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:mooshroom_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:mule_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:npc_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:ocelot_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:panda_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:parrot_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:phantom_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:pig_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:piglin_brute_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:piglin_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:pillager_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:polar_bear_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:pufferfish_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:rabbit_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:ravager_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:salmon_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:sheep_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:shulker_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:silverfish_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:skeleton_horse_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:skeleton_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:slime_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:spider_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:squid_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:stray_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:strider_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:tropical_fish_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:turtle_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:vex_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:villager_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:vindicator_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:wandering_trader_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:witch_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:wither_skeleton_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:wolf_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:zoglin_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:zombie_horse_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:zombie_pigman_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:zombie_spawn_egg',
        response: 3
    },
    {
        id: 'minecraft:zombie_villager_spawn_egg',
        response: 3
    },
    //items////////////////////////////////////////////////////////
    {
        id: 'minecraft:writable_book',
        response: 1 
    },
    {
        id: 'minecraft:pufferfish_bucket',
        response: 1
    },
    {
        id: 'minecraft:axolotl_bucket',
        response: 1
    },
    {
        id: 'minecraft:cod_bucket',
        response: 1
    },
    {
        id: 'minecraft:powder_snow_bucket',
        response: 1
    },
    {
        id: 'minecraft:salmon_bucket',
        response: 1
    },
    {
        id: 'minecraft:tropical_fish_bucket',
        response: 1
    },
    {
        id: 'minecraft:lingering_potion',
        response: 1
    },
    {
        id: 'minecraft:splash_potion',
        data: 24,
        response: 1
    },
    {
        id: 'minecraft:respawn_anchor',
        response: 1
    },
    {
        id: 'minecraft:ender_pearl',
        response: 1
    },
    {
        id: 'minecraft:arrow',
        data: 25,
        response: 1
    }
    ,
    {
        id: 'minecraft:elytra',
        response: 1
    },
    {
        id: 'minecraft:undyed_shulker_box',
        response: 1
    },
    {
        id: 'minecraft:shulker_box',
        response: 1
    },
    {
        id: 'minecraft:sticky_piston',
        response: 1
    }
]
export { bannedItems };

// 1 0 {"item_lock": {"mode": "lock_in_slot"}}