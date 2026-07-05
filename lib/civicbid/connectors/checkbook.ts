export type CheckbookContractsSampleOptions = {
  endpoint?: string;
  maxRecords?: number;
  status?: string;
  category?: string;
};

function buildContractsSampleXml({
  maxRecords = 10,
  status = "registered",
  category = "expense",
}: CheckbookContractsSampleOptions) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<request>
  <type_of_data>Contracts</type_of_data>
  <records_from>1</records_from>
  <max_records>${maxRecords}</max_records>
  <search_criteria>
    <criteria>
      <name>status</name>
      <type>value</type>
      <value>${status}</value>
    </criteria>
    <criteria>
      <name>category</name>
      <type>value</type>
      <value>${category}</value>
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
}

export async function fetchCheckbookContractsSample(options: CheckbookContractsSampleOptions = {}) {
  const endpoint = options.endpoint ?? "https://www.checkbooknyc.com/api";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/xml",
      "Content-Type": "application/xml",
    },
    body: buildContractsSampleXml(options),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Checkbook NYC fetch failed: ${response.status} ${response.statusText}`);
  }

  return text;
}
