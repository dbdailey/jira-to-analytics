import { JiraExtractorConfig } from '../types';
import * as moment from 'moment';

class JiraWorkItem  {
  id: string;
  stageDates: Array<string>;
  name: string;
  type: string;
  daysBlocked: number;
  attributes: {
    [val: string]: string;
  };
  constructor(id: string = '', stageDates: string[] = [], name: string = '', type: string = '', daysBlocked: number = 0, attributes: {} = {}) {
    this.id = id;
    this.stageDates = stageDates;
    this.name = name;
    this.type = type;
    this.daysBlocked = daysBlocked;
    this.attributes = attributes;
  }

  toCSV(config: JiraExtractorConfig): string {
    let s = '';
    s += `${this.id},`;

    if (config.featureFlags && config.featureFlags['MaskLink']) {
      s += ',';
    } else {
      s += `${config.connection.url}/browse/${this.id},`;
    }

    s += `${(JiraWorkItem.cleanString(this.name))}`;
    if (isEmpty(config.outputDateformat)) {
      this.stageDates.forEach(stageDate => s += `,${(stageDate)}`);
    }
    else {
      this.stageDates.forEach(stageDate => {
        if (!isEmpty(stageDate)){
          s += `,${moment(stageDate).format(config.outputDateformat)}`;
        } else {
          s += ',';
        }
      });
    }
    if (config.blockedAttributes.length > 0){
      s += `,${this.daysBlocked}`;
    }
    s += `,${this.type}`;

    const attributeKeys = this.attributes ? Object.keys(this.attributes) : [];
    if (attributeKeys.length === 0) {
      s += ',';
    } else {
      attributeKeys.forEach(attributeKey => {
        s += `,${JiraWorkItem.cleanString(this.attributes[attributeKey])}`;
      });
    }

    return s;
  }

  toSerializedArray(): string {
    let s = '';
    s += '[';
    s += `"${this.id}",`;
    s += `"",`;
    s += `"${(JiraWorkItem.cleanString(this.name))}"`;
    this.stageDates.forEach(stageDate => s += `,"${stageDate}"`);
    s += `,"${this.type}"`;

    const attributeKeys = Object.keys(this.attributes);
    attributeKeys.forEach(attributeKey => {
      s += `,"${JiraWorkItem.cleanString(this.attributes[attributeKey])}"`;
    });
    s += ']';

    return s;
  };

  static cleanString(s: string = ''): string {
    return s.replace(/"/g, '')
    .replace(/'/g, '')
    .replace(/,/g, '')
    .replace(/\\/g, '')
    .trim();
  };
};

function isEmpty(str) {
  return (!str || 0 === str.length);
};

export {
  JiraWorkItem,
};