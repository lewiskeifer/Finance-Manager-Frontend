import { Component, OnInit } from '@angular/core';
import { LineChartConfig } from '../google-charts/line-chart-config';
import { Deck } from '../_model/deck';
import { User } from '../_model/user';
import { DeckService } from '../_service/deck.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {

  currentUser: User;
  showWelcomePage: boolean;
  screenwidth: any;

  loading: boolean;

  decks: Deck[];
 
  data: any[];
  config: LineChartConfig;
  elementId: string;

  data2: any[];
  config2: LineChartConfig;
  elementId2: string;

  constructor(private deckService: DeckService) { }
 
  ngOnInit() {
    this.loading = true;
    this.screenwidth = window.innerWidth;
    this.elementId = 'linechart_material';
    this.elementId2 = 'linechart_material2';

    if (this.screenwidth < 1000) {
      this.config = new LineChartConfig('Total Value', '', 1000, 300);
      this.config2 = new LineChartConfig('Value / Purchase Price', '', 1000, 300);
    }
    else {
      this.config = new LineChartConfig('Total Value', '', 1000, 800);
      this.config2 = new LineChartConfig('Value / Purchase Price', '', 1000, 800);
    }

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.getDecks();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenwidth = event.target.innerWidth;
    if (this.screenwidth < 1000) {
      this.config = new LineChartConfig('Total Value', '', 500, 400);
      this.config2 = new LineChartConfig('Value / Purchase Price', '', 500, 400);
      this.setChart();
    }
  }
 
  getDecks(): void {
    this.deckService.getDecks(this.currentUser.id)
      .subscribe(decks => { 
        this.decks = decks;
        if (this.decks.length > 1 && this.decks[1].deckSnapshots.length > 0) { 
          this.showWelcomePage = false;
          this.setChart(); }
        else { 
          this.showWelcomePage = true; 
        } 
        this.loading = false;
      });
  }

  // Format data sent to google chart service
  setChart(): void {

    // Total Price Chart
    this.data = [[]];

    // Ratio Chart
    this.data2 = [[]];

    var names = [];

    names.push("Deck Overview");
    for (var _i = 1; _i < this.decks.length; ++_i) {
      names.push(this.decks[_i].name);
    }

    this.data[0] = names;
    this.data2[0] = names;

    var rows = [[]];
    var rows2 = [[]];

    var dates = [];

    // First deck must have most snapshots; create array of y axis points
    for (var _j = 0; _j < this.decks[1].deckSnapshots.length; ++_j) {
      dates.push(this.decks[1].deckSnapshots[_j].timestamp.substr(0,10));
    }

    for (var _j = 0; _j < dates.length; ++_j) {

      var deckOverviewValue = 0;
      var deckOverviewPurchasePrice = 0;

      var row = [];
      var row2 = [];

      row.push(dates[_j]);
      row2.push(dates[_j]);
      
      // K == 0, skip deck overview
      row.push(0);
      row2.push(0);

      // K == 1+
      for (var _k = 1; _k < this.decks.length; ++_k) {

        var numSnapshots = this.decks[_k].deckSnapshots.length;
        var snapshotIndex = _j;

        // Set invalid dates to zero values
        if (numSnapshots < dates.length && snapshotIndex < (dates.length - numSnapshots)) {
          row.push(0);
          row2.push(0);
        }
        else {

          // Adjust index on decks with fewer snapshots
          if (numSnapshots < dates.length) {
            snapshotIndex -= (dates.length - numSnapshots);
          }

          var value = this.decks[_k].deckSnapshots[snapshotIndex].value;
          deckOverviewValue += value;
          row.push(value);

          var purchasePrice = this.decks[_k].deckSnapshots[snapshotIndex].purchasePrice;
          deckOverviewPurchasePrice += purchasePrice;

          // Check for division by 0
          if (purchasePrice !== 0) {
            row2.push(value / purchasePrice);
          }
          else {
            row2.push(0);
          }
        }
      }

      row[1] = deckOverviewValue;
      rows[_j] = row;

      if (deckOverviewPurchasePrice !== 0) {
        row2[1] = deckOverviewValue / deckOverviewPurchasePrice;
      }
      else {
        row2[1] = 0;
      }
      rows2[_j] = row2;
    }

    this.data[1] = rows;

    this.data2[1] = rows2;
  }
}
