import { OskioskClientPage } from './app.po';

describe('oskiosk-client App', () => {
  let page: OskioskClientPage;

  beforeEach(() => {
    page = new OskioskClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
