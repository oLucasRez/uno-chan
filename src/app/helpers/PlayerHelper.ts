import { User, Client } from 'discord.js';

import Game from '../models/Game';
import Logger from '../../logger';

import { IPlayer } from '../../ts/interface/IPlayer';
import { IGame, IGameDocument } from '../../ts/interface/IGame';

import { Response } from '../../ts/enum/Response';

class PlayerHelper {
  public static createEmptyPlayer(id: string): IPlayer {
    return { id, hand: { cards: [], sent: [] } };
  }

  public static getUser(client: Client, id: string): Promise<User> {
    return client.users.fetch(id);
  }

  public static async enterPlayer(
    game: IGame | IGameDocument,
    player: IPlayer
  ): Promise<Response> {
    const { channelId } = game;

    if (game?.players.find(_player => _player.id === player.id)) {
      return Response.PLAYER_ALREADY_CREATED;
    } else if (game) {
      await Game.updateOne({ channelId }, { $push: { players: player } });

      return Response.SUCCESS;
    } else {
      Logger.serverError('Game not created yet');

      return Response.GAME_NOT_CREATED;
    }
  }
}

export default PlayerHelper;