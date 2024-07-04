import { ScannedIDCard } from '@/app/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class IDCardManager {

  static async saveIDCard(card:ScannedIDCard) {
    await AsyncStorage.setItem(card.timestamp.toString(),JSON.stringify(card));
  }

  static async deleteIDCard(key:string) {
    await AsyncStorage.removeItem(key);
  }

  static async getKeys(){
    return await AsyncStorage.getAllKeys();
  }

  static async getIDCard(key:string){
    let jsonStr:string|null = await AsyncStorage.getItem(key);
    if (jsonStr) {
      let card:ScannedIDCard = JSON.parse(jsonStr);
      return card;
    }else{
      return null;
    }
  }

  static async listIDCards(){
    let cards:ScannedIDCard[] = [];
    let keys = await this.getKeys();
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let card = await this.getIDCard(key);
      if (card) {
        cards.push(card);
      }
    }
    return cards;
  }
}