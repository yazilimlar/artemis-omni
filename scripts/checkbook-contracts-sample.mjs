#!/usr/bin/env node

/**
 * Checkbook NYC Contracts API sample.
 *
 * Documentation:
 * - https://www.checkbooknyc.com/api-page
 * - https://www.checkbooknyc.com/contract-api
 *
 * The API accepts XML over HTTP POST.
 */

const endpoint = "https://www.checkbooknyc.com/api";

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<request>
  <type_of_data>Contracts</type_of_data>
  <records_from>1</records_from>
  <max_records>10</max_records>
  <search_criteria>
    <criteria>
      <name>status</name>
      <type>value</type>
      <value>registered</value>
    </criteria>
    <criteria>
      <name>category</name>
      <type>value</type>
      <value>expense</value>
    </criteria>
  </search_criteria>
  <response_columns>
    <column>prime_contract_id</column>
    <column>prime_vendor</column>
    <column>prime_contract_purpose</column>
    <column>prime_contract_current_amount</column>
    <column>agency_name</column>
  </response_columns>
</request>`;

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    Accept: "application/xml",
    "Content-Type": "application/xml",
    "User-Agent": "Artemis-CivicBid-Dev/1.0",
  },
  body: xml,
});

const text = await response.text();

console.log(`Status: ${response.status}`);
console.log(text.slice(0, 4000));
