import fs from 'fs';
import Handlebars from 'handlebars';
import juice from 'juice';

import { Sendgrid } from '../shared/utils/sendgrid';

class NotificationsBase {
  constructor(availabilityRequest) {
    this.availabilityRequest = availabilityRequest;
    this.sendgrid = new Sendgrid();
  }

  deliver() {
    return this._deliver().then((response) => {
      return response;
    });
  }

  _deliver() {
    return this.sendgrid.deliver(this._emailParams()).then((response) => {
      return response;
    });
  }

  // TODO - refactor out into its own utility
  _compileTemplate() {
    const templateFilename = __dirname + '/../templates/' + this.template;
    const templateFile = fs.readFileSync(templateFilename, { encoding: 'utf8' });
    const compiledTemplate = Handlebars.compile(templateFile);
    const compiledTemplateHtml = compiledTemplate(this.availabilityRequest);
    const compiledTemplateHtmlInlined = juice(compiledTemplateHtml);
    return compiledTemplateHtmlInlined;
  }

  _emailParams() {
    return {
      to: this.availabilityRequest.email,
      subject: this.subject,
      html: this._compileTemplate(),
    };
  }
}

export { NotificationsBase };
