import { Region, WhiskeyType } from '../types';

export const MIDDLE_INITIALS = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.', 'K.', 'L.', 'M.', 'N.', 'O.', 'P.', 'Q.', 'R.', 'S.', 'T.', 'U.', 'V.', 'W.', 'X.', 'Y.', 'Z.'];

export const REGIONAL_NAMES: Record<Region, {
  prefixes: string[];
  suffixes: string[];
  firstNames: string[];
  lastNames: string[];
  places: string[];
}> = {
  [Region.USA]: {
    prefixes: ['Old', 'Colonel', 'Rebel', 'Frontier', 'Pioneer', 'Eagle', 'Copper', 'Iron', 'Wild', 'Grand', 'Southern', 'Mountain', 'Straight', 'Honest', 'Noble', 'Rustic', 'Vintage', 'Heritage', 'Liberty', 'Patriot', 'Canyon', 'Prairie', 'Valley', 'Timber'],
    suffixes: ['Reserve', 'Cask', 'Barrel', 'Springs', 'Creek', 'Ridge', 'Run', 'Branch', 'Hollow', 'Estate', 'Select', 'Batch', 'Trace', 'Hill', 'Wood', 'Blend', 'Spirits', 'Bourbon', 'Rye', 'Mash', 'Proof', 'Char', 'Oak'],
    firstNames: ['George', 'Henry', 'Jacob', 'James', 'John', 'Joseph', 'William', 'Thomas', 'J.', 'W.', 'E.', 'A.', 'C.', 'Arthur', 'Charles', 'Edward', 'Frank', 'Harry', 'Oliver', 'Samuel', 'Walter', 'Albert', 'David', 'Martin', 'Robert'],
    lastNames: ['Smith', 'Johnson', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis'],
    places: ['Kentucky', 'Tennessee', 'Bluegrass', 'Limestone', 'Licking', 'Elkhorn', 'Appalachia', 'Cumberland', 'Smoky', 'Shenandoah', 'Ozark', 'Mississippi', 'Ohio', 'Bourbon County', 'Nelson County', 'Franklin', 'Anderson', 'Marion', 'Mercer']
  },
  [Region.SCOTLAND]: {
    prefixes: ['Glen', 'Ben', 'Mac', 'Loch', 'Strath', 'Aber', 'Craig', 'Inver', 'Royal', 'Highland', 'Isle of', 'The', 'Auld', 'Dun', 'Kil', 'Bal', 'Dal', 'Kin', 'Auch', 'Brae', 'Cairn', 'Drum', 'Fetter', 'Tull'],
    suffixes: ['Wood', 'Reserve', 'Malt', 'Cask', 'Blend', 'Spirits', 'Water', 'Burn', 'Firth', 'Moor', 'Glen', 'Loch', 'Ben', 'Strath', 'Aber', 'Craig', 'Inver', 'Port', 'Dun', 'Kil', 'Bal', 'Dal', 'Kin', 'Auch'],
    firstNames: ['Angus', 'Hamish', 'Malcolm', 'Alistair', 'Callum', 'Ewan', 'Finlay', 'Gavin', 'Ian', 'Lachlan', 'Aodh', 'Baird', 'Blair', 'Brodie', 'Bruce', 'Cameron', 'Colin', 'Cormac', 'Craig', 'Crawford', 'Douglas', 'Fergus', 'Fletcher', 'Forbes', 'Fraser', 'Gordon', 'Graham', 'Grant', 'Gregor', 'Iain', 'Innes', 'Irvine', 'Keith', 'Kenneth', 'Lennox', 'Logan', 'Magnus', 'Munro', 'Murdo', 'Niall', 'Ramsay', 'Rory', 'Ross', 'Ruairidh', 'Sinclair', 'Stuart', 'Tavish', 'Wallace'],
    lastNames: ['Campbell', 'Stewart', 'MacDonald', 'Fraser', 'Graham', 'MacLeod', 'MacFarlane', 'MacKenzie', 'MacKay', 'MacLean', 'MacIntosh', 'MacGregor', 'MacMillan', 'MacPherson', 'MacAlister', 'MacDougall', 'MacNab', 'MacAulay', 'MacKinnon', 'MacLaren', 'MacRae', 'MacNeil', 'MacEwan', 'MacIver', 'MacInnes', 'Buchanan', 'Munro', 'Wallace', 'Bruce', 'Sinclair'],
    places: ['Highland', 'Lowland', 'Speyside', 'Islay', 'Campbeltown', 'Skye', 'Orkney', 'Jura', 'Arran', 'Fife', 'Lothian', 'Clyde', 'Tweed', 'Tay', 'Forth', 'Dee', 'Don', 'Spey', 'Findhorn', 'Lossie', 'Deveron', 'Ythan', 'Ugie', 'Ness', 'Beauly']
  },
  [Region.IRELAND]: {
    prefixes: ['Bally', 'Kil', 'Dun', 'Knock', 'Carrick', 'Old', 'The', 'Celtic', 'Emerald', 'Shamrock', 'Wild', 'Green', 'Saint', 'Gaelic', 'Clover', 'Leprechaun', 'Blarney', 'Tara', 'Boyne', 'Shannon', 'Liffey', 'Corrib', 'Erne', 'Foyle'],
    suffixes: ['Dew', 'Cask', 'Still', 'Reserve', 'Estate', 'Valley', 'Stream', 'Mill', 'Bridge', 'Cross', 'Point', 'Meadow', 'Isle', 'Castle', 'Grange', 'Blend', 'Spirits', 'Malt', 'Pot Still', 'Grain', 'Oak', 'Wood', 'Char'],
    firstNames: ['Patrick', 'Michael', 'Sean', 'Liam', 'Conor', 'Declan', 'Aidan', 'Brendan', 'Cian', 'Darragh', 'Eoin', 'Fionn', 'Oisin', 'Ronan', 'Cillian', 'Cathal', 'Cormac', 'Daithi', 'Dermot', 'Donal', 'Eamon', 'Enda', 'Fergal', 'Finbar', 'Garret', 'Kieran', 'Lorcan', 'Niall', 'Odhran', 'Padraig', 'Peadar', 'Rian', 'Ruairi', 'Tadhg', 'Tiernan'],
    lastNames: ['Murphy', 'Kelly', 'O\'Sullivan', 'Walsh', 'O\'Brien', 'Byrne', 'Ryan', 'Connor', 'O\'Neill', 'O\'Reilly', 'Doyle', 'McCarthy', 'Gallagher', 'Doherty', 'Lynch', 'Quinn', 'McLoughlin', 'Connolly', 'Healy', 'Fitzgerald', 'Kavanagh', 'Maguire', 'O\'Donnell', 'O\'Keeffe', 'O\'Mahony', 'O\'Rourke', 'Sweeney'],
    places: ['Dublin', 'Cork', 'Galway', 'Belfast', 'Munster', 'Leinster', 'Connacht', 'Ulster', 'Kerry', 'Clare', 'Limerick', 'Tipperary', 'Waterford', 'Wexford', 'Kilkenny', 'Wicklow', 'Kildare', 'Meath', 'Louth', 'Antrim', 'Down', 'Armagh', 'Tyrone', 'Derry', 'Donegal']
  },
  [Region.CANADA]: {
    prefixes: ['Northern', 'Crown', 'Royal', 'Maple', 'Glacier', 'Bear', 'Wolf', 'Moose', 'Great', 'Black', 'True', 'North', 'Ice', 'Snow', 'Winter', 'Polar', 'Arctic', 'Tundra', 'Boreal', 'Pine', 'Cedar', 'Birch', 'Oak', 'Elm'],
    suffixes: ['Club', 'Mist', 'Peak', 'Lake', 'Valley', 'Crest', 'Ridge', 'Wood', 'Cask', 'Reserve', 'Gold', 'Blend', 'Harvest', 'Shield', 'Spirits', 'Rye', 'Malt', 'Grain', 'Oak', 'Char', 'Barrel', 'Springs'],
    firstNames: ['Jean', 'Pierre', 'Jacques', 'Michel', 'Claude', 'Gilles', 'Guy', 'Luc', 'Marc', 'Paul', 'René', 'Yves', 'Alain', 'Benoit', 'Denis', 'Éric', 'François', 'Gérard', 'Henri', 'Louis', 'Marcel', 'Normand', 'Pascal', 'Raymond', 'Serge', 'Sylvain', 'Yvon', 'Gaston', 'Maurice', 'Réjean'],
    lastNames: ['Tremblay', 'Roy', 'Gagnon', 'Bouchard', 'Gauthier', 'Morin', 'Lavoie', 'Fortin', 'Pelletier', 'Bélanger', 'Lefebvre', 'Martel', 'Landry', 'Côté', 'Ouellet', 'Tardif', 'Poirier', 'Desjardins', 'Lapointe', 'Savard', 'Richard', 'Michaud', 'Caron', 'Hébert', 'Poulin'],
    places: ['Ontario', 'Alberta', 'Quebec', 'Nova Scotia', 'Yukon', 'Rockies', 'Toronto', 'Montreal', 'Vancouver', 'Niagara', 'Banff', 'Jasper', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Halifax', 'Victoria', 'Regina', 'Saskatoon', 'St. John\'s', 'Charlottetown', 'Fredericton', 'Whitehorse', 'Yellowknife']
  },
  [Region.JAPAN]: {
    prefixes: ['Yama', 'Kawa', 'Matsu', 'Take', 'Ume', 'Kiku', 'Sakura', 'Fuji', 'Shin', 'Hon', 'Kura', 'Tsuru', 'Kame', 'Gin', 'Kin', 'Aka', 'Ao', 'Shiro', 'Kuro', 'Midori', 'Ki', 'Murasaki', 'O', 'Ko'],
    suffixes: ['Zaki', 'Kushu', 'Tori', 'Mura', 'Gawa', 'Yama', 'Kawa', 'Cask', 'Reserve', 'Blend', 'Malt', 'Estate', 'Spirits', 'Oak', 'Wood', 'Barrel', 'Springs', 'Lake', 'Valley', 'Peak', 'Ridge', 'Crest'],
    firstNames: ['S.', 'M.', 'K.', 'T.', 'Y.', 'H.', 'Kenji', 'Taro', 'Akira', 'Hiroshi', 'Ichiro', 'Jiro', 'Saburo', 'Shiro', 'Goro', 'Rokuro', 'Shichiro', 'Hachiro', 'Kuro', 'Juro', 'Yuki', 'Haru', 'Natsu', 'Aki', 'Fuyu'],
    lastNames: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Saito', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu', 'Yamazaki', 'Mori', 'Abe', 'Ikeda', 'Hashimoto'],
    places: ['Kyoto', 'Hokkaido', 'Osaka', 'Tokyo', 'Sendai', 'Honshu', 'Kyushu', 'Shikoku', 'Okinawa', 'Sapporo', 'Fukuoka', 'Kobe', 'Nagoya', 'Yokohama', 'Hiroshima', 'Nagasaki', 'Kanazawa', 'Nara', 'Kamakura', 'Nikko', 'Hakone', 'Fuji', 'Aso', 'Biwa', 'Seto']
  }
};

export const REGION_TYPE_MAP: Record<Region, WhiskeyType[]> = {
  [Region.USA]: [WhiskeyType.BOURBON, WhiskeyType.RYE],
  [Region.CANADA]: [WhiskeyType.CANADIAN_WHISKY],
  [Region.SCOTLAND]: [WhiskeyType.SINGLE_MALT_SCOTCH],
  [Region.IRELAND]: [WhiskeyType.IRISH_WHISKEY],
  [Region.JAPAN]: [WhiskeyType.JAPANESE_WHISKY],
};
