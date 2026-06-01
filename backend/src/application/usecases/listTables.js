async function listTables({ companyId }, { tableRepository }) {
  const tables = await tableRepository.listTables(companyId);

  return tables.map(table => {
    const session = table.sessions?.[0] || null;
    return {
      ...table,
      sessions: undefined,
      activeSession: session
        ? {
            ...session,
            durationMinutes: Math.floor(
              (Date.now() - new Date(session.openedAt).getTime()) / 60000
            )
          }
        : null
    };
  });
}

module.exports = listTables;
