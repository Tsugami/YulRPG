const Discord = require('discord.js');
const { StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { ApplicationCommandType } = require('discord.js');
const UsersRPG = require('../../Schemas/UserRPG');
const rawClasses = require('../../RawsRPG/classes.json');

module.exports = {
  name: 'rpgstart',
  description: 'Participe do rpg usando esse comando.',
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const user = await UsersRPG.findOne({
      id: interaction.user.id,
    });

    const Entrou = new Discord.EmbedBuilder()
      .setTitle('✅ Parabéns!')
      .setDescription(
        'Você acaba de entrar no meu RPG e ganhou um bonus de 200XP no meu sistema de level Global. \nNão sabe como jogar o RPG? acesse: https://yulbot.vercel.app/rpg ou digite /help.',
      );

    const isNewUser = !user;

    if (isNewUser) {
      const Menu = new Discord.EmbedBuilder()
        .setColor('A600FF')
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          'Selecione a sua Classe para ver suas informações e então clique em confirmar.',
        )
        .setFooter({ text: `© ${client.user.username} 2023 | ...` })
        .setTimestamp();

      const classesOptions = rawClasses.map((rpgClass) => ({
        label: rpgClass.name,
        description: 'Veja as informações sobre essa classe.',
        emoji: rpgClass.emoji ?? '❓',
        value: rpgClass.id,
      }));

      const painel = new Discord.ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('menu')
          .setPlaceholder('Selecione uma classe abaixo.')
          .addOptions([
            {
              label: 'Seleção de Classe',
              description: 'Volte para a pagina inicial.',
              emoji: '◀',
              value: 'home',
            },
            ...classesOptions,
          ]),
      );

      await interaction
        .reply({
          embeds: [Menu],
          content: `${interaction.user}`,
          components: [painel],
          fetchReply: true,
        })
        .then(async (message) => {
          const filtro = (i) => i.user.id === interaction.user.id;
          const coletor = await message.channel.createMessageComponentCollector({
            filtro,
            time: 600000,
          });

          coletor.on('collect', async (collected) => {
            if (collected.isSelectMenu()) {
              const valor = collected.values[0];
              collected.deferUpdate();

              const rpgClasse = rawClasses.find((rpgClass) => valor === rpgClass.id);

              if (rpgClasse) {
                const embed = new Discord.EmbedBuilder()
                  .setTitle(`CLASSE - ${rpgClasse.name.toUpperCase()}`)
                  .setColor('#A600FF')
                  .setThumbnail(rpgClasse.icon)
                  .setDescription(`${rpgClasse.description}`)

                  .addFields(
                    {
                      name: 'Status Gerais',
                      value: `<:hp:1065001128758100108> **Vida:** ${rpgClasse.stats.hp}\n<:mana:1065002395978969168> **Mana:** ${rpgClasse.stats.mp}\n<:armor:1065004216835387492> **Armadura:** ${rpgClasse.stats.armor}\n<:dmg:1065003206968615084> **Dano:** ${rpgClasse.stats.attackdamage}`,
                      inline: false,
                    },
                    {
                      name: 'Armas Usadas',
                      value: rpgClasse.weapons.join(', '),
                      inline: false,
                    },
                    {
                      name: 'Habilidades',
                      value: rpgClasse.skills.join(', '),
                      inline: false,
                    },
                    {
                      name: 'Ultimate',
                      value: `**${rpgClasse.ultimate}**\n${rpgClasse.ultimatedesc}`,
                      inline: false,
                    },
                  )
                  .setFooter({ text: `© ${client.user.username} 2023 | ...` })
                  .setTimestamp();

                const confirmButton = new Discord.ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId(`confirm:${rpgClasse.id}`)
                    .setLabel('Confirmar')
                    .setStyle(ButtonStyle.Success),
                );

                await interaction.editReply({
                  embeds: [embed],
                  content: `${interaction.user}`,
                  components: [painel, confirmButton],
                });

                return;
              }

              if (valor === 'home') {
                return interaction.editReply({
                  embeds: [Menu],
                  content: `${interaction.user}`,
                  components: [painel],
                });
              }

              const customId = collected.customId;
              if (customId === 'confirmaViking') {
                const confirmVkn = new Discord.EmbedBuilder()

                  .setTitle('Classe Escolhida com sucesso')
                  .setColor('A600FF')
                  .setThumbnail(rawClasses[0].icon)
                  .setDescription(
                    'Você escolheu sua classe com sucesso! Para começar a jogar digite /Jogar',
                  )
                  .addFields({
                    name: 'VIKING',
                    value: 'VIKINGZINHO MEU MANO',
                    inline: false,
                  })
                  .setFooter({ text: `© ${client.user.username} 2023 | ...` })
                  .setTimestamp();

                await UsersRPG.create({
                  id: interaction.user.id,
                  discordName: interaction.user.username,
                  skill1: rawClasses[0].skills[0],
                  skill2: rawClasses[0].skills[1],
                  skill3: rawClasses[0].skills[2],
                  ult: rawClasses[0].ultimate,
                  hpatual: rawClasses[0].stats.hp,
                  hpmax: rawClasses[0].stats.hp,
                  hpUp: rawClasses[0].stats.hpperlevel,
                  dano: rawClasses[0].stats.attackdamage,
                  danoUp: rawClasses[0].stats.attackdamageperlevel,
                  manaatual: rawClasses[0].stats.mp,
                  manamax: rawClasses[0].stats.mp,
                  manaUp: rawClasses[0].stats.mpperlevel,
                  armor: rawClasses[0].stats.armor,
                  armorUp: rawClasses[0].stats.armorperlevel,
                  arma1: rawClasses[0].weapons[0],
                  arma2: rawClasses[0].weapons[1],
                  classe: rawClasses[0].name,
                });

                await interaction.editReply({
                  embeds: [Entrou, confirmVkn],
                  content: `${interaction.user}`,
                  components: [],
                });
              } else if (customId === 'confirmaArqueiro') {
                const confirmArq = new Discord.EmbedBuilder()

                  .setTitle('Classe Escolhida com sucesso')
                  .setColor('A600FF')
                  .setThumbnail(`${rawClasses[1].icon}`)
                  .setDescription(
                    'Você escolheu sua classe com sucesso! Para começar a jogar digite /Jogar',
                  )
                  .addFields({
                    name: 'ARQUEIRO',
                    value: 'ARQUEIROZINHO MEU MANO',
                    inline: false,
                  })
                  .setFooter({ text: `© ${client.user.username} 2023 | ...` })
                  .setTimestamp();

                await UsersRPG.create({
                  id: interaction.user.id,
                  discordName: interaction.user.username,
                  skill1: rawClasses[1].skills[0],
                  skill2: rawClasses[1].skills[1],
                  skill3: rawClasses[1].skills[2],
                  ult: rawClasses[1].ultimate,
                  hpatual: rawClasses[1].stats.hp,
                  hpmax: rawClasses[1].stats.hp,
                  hpUp: rawClasses[1].stats.hpperlevel,
                  dano: rawClasses[1].stats.attackdamage,
                  danoUp: rawClasses[1].stats.attackdamageperlevel,
                  manaatual: rawClasses[1].stats.mp,
                  manamax: rawClasses[1].stats.mp,
                  manaUp: rawClasses[1].stats.mpperlevel,
                  armor: rawClasses[1].stats.armor,
                  armorUp: rawClasses[1].stats.armorperlevel,
                  arma1: rawClasses[1].weapons[0],
                  classe: rawClasses[1].name,
                });

                await interaction.editReply({
                  embeds: [Entrou, confirmArq],
                  content: `${interaction.user}`,
                  components: [],
                });
              } else if (customId === 'confirmaSamurai') {
                const confirmSam = new Discord.EmbedBuilder()

                  .setTitle('Classe Escolhida com sucesso')
                  .setColor('A600FF')
                  .setThumbnail(`${rawClasses[2].icon}`)
                  .setDescription(
                    'Você escolheu sua classe com sucesso! Para começar a jogar digite /Jogar',
                  )
                  .addFields({
                    name: 'SAMURAI',
                    value: 'SAMURAIZINHO MEU MANO',
                    inline: false,
                  })
                  .setFooter({ text: `© ${client.user.username} 2023 | ...` })
                  .setTimestamp();

                await UsersRPG.create({
                  id: interaction.user.id,
                  discordName: interaction.user.username,
                  skill1: rawClasses[2].skills[0],
                  skill2: rawClasses[2].skills[1],
                  skill3: rawClasses[2].skills[2],
                  ult: rawClasses[2].ultimate,
                  hpatual: rawClasses[2].stats.hp,
                  hpmax: rawClasses[2].stats.hp,
                  hpUp: rawClasses[2].stats.hpperlevel,
                  dano: rawClasses[2].stats.attackdamage,
                  danoUp: rawClasses[2].stats.attackdamageperlevel,
                  manaatual: rawClasses[2].stats.mp,
                  manamax: rawClasses[2].stats.mp,
                  manaUp: rawClasses[2].stats.mpperlevel,
                  armor: rawClasses[2].stats.armor,
                  armorUp: rawClasses[2].stats.armorperlevel,
                  arma1: rawClasses[2].weapons[0],
                  classe: rawClasses[2].name,
                });

                await interaction.editReply({
                  embeds: [Entrou, confirmSam],
                  content: `${interaction.user}`,
                  components: [],
                });
              } else if (customId === 'confirmaPaladin') {
                const confirmPal = new Discord.EmbedBuilder()

                  .setTitle('Classe Escolhida com sucesso')
                  .setColor('A600FF')
                  .setThumbnail(`${rawClasses[3].icon}`)
                  .setDescription(
                    'Você escolheu sua classe com sucesso! Para começar a jogar digite /Jogar',
                  )
                  .addFields({
                    name: 'PALADINO',
                    value: 'PALADINOZINHO MEU MANO',
                    inline: false,
                  })
                  .setFooter({ text: `© ${client.user.username} 2023 | ...` })
                  .setTimestamp();

                await UsersRPG.create({
                  id: interaction.user.id,
                  discordName: interaction.user.username,
                  skill1: rawClasses[3].skills[0],
                  skill2: rawClasses[3].skills[1],
                  skill3: rawClasses[3].skills[2],
                  ult: rawClasses[3].ultimate,
                  hpatual: rawClasses[3].stats.hp,
                  hpmax: rawClasses[3].stats.hp,
                  hpUp: rawClasses[3].stats.hpperlevel,
                  dano: rawClasses[3].stats.attackdamage,
                  danoUp: rawClasses[3].stats.attackdamageperlevel,
                  manaatual: rawClasses[3].stats.mp,
                  manamax: rawClasses[3].stats.mp,
                  manaUp: rawClasses[3].stats.mpperlevel,
                  armor: rawClasses[3].stats.armor,
                  armorUp: rawClasses[3].stats.armorperlevel,
                  arma1: rawClasses[3].weapons[0],
                  arma2: rawClasses[3].weapons[1],
                  classe: rawClasses[3].name,
                });

                await interaction.editReply({
                  embeds: [Entrou, confirmPal],
                  content: `${interaction.user}`,
                  components: [],
                });
              } else if (customId === 'confirmaDemon') {
                const confirmDmn = new Discord.EmbedBuilder()

                  .setTitle('Classe Escolhida com sucesso')
                  .setColor('A600FF')
                  .setThumbnail(`${rawClasses[4].icon}`)
                  .setDescription(
                    'Você escolheu sua classe com sucesso! Para começar a jogar digite /Jogar',
                  )
                  .addFields({
                    name: 'DEMON',
                    value: 'DEMONZINHO MEU MANO',
                    inline: false,
                  })
                  .setFooter({ text: `© ${client.user.username} 2023 | ...` })
                  .setTimestamp();

                await UsersRPG.create({
                  id: interaction.user.id,
                  discordName: interaction.user.username,
                  skill1: rawClasses[4].skills[0],
                  skill2: rawClasses[4].skills[1],
                  skill3: rawClasses[4].skills[2],
                  ult: rawClasses[4].ultimate,
                  hpatual: rawClasses[4].stats.hp,
                  hpmax: rawClasses[4].stats.hp,
                  hpUp: rawClasses[4].stats.hpperlevel,
                  dano: rawClasses[4].stats.attackdamage,
                  danoUp: rawClasses[4].stats.attackdamageperlevel,
                  manaatual: rawClasses[4].stats.mp,
                  manamax: rawClasses[4].stats.mp,
                  manaUp: rawClasses[4].stats.mpperlevel,
                  armor: rawClasses[4].stats.armor,
                  armorUp: rawClasses[4].stats.armorperlevel,
                  arma1: rawClasses[4].weapons[0],
                  classe: rawClasses[4].name,
                });

                await interaction.editReply({
                  embeds: [Entrou, confirmDmn],
                  content: `${interaction.user}`,
                  components: [],
                });
              }
            }
          });
        });
    } else {
      const embed = new Discord.EmbedBuilder()
        .setTitle(':x: Ops, parece que você já está no meu RPG!')
        .setDescription(
          'Não sabe como jogar o RPG? acesse: https://yulbot.vercel.app/rpg ou digite /help.',
        );

      return interaction.reply({ embeds: [embed] });
    }
  },
};
