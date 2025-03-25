"use client";

import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Button,
  Tooltip,
  Divider,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import StatusChip from "./StatusChip";
import { useCampaignStore } from "@/store/campaignStore";
import { Campaign, CampaignType, CampaignStatus } from "@/types/compaign.types";
import {
  getCampaignStatus,
  formatNextActivation,
} from "@/utils/schedule-utils";

interface CampaignListProps {
  campaigns?: Campaign[];
  onShowNotification: (message: string, severity: "success" | "error") => void;
}

export default function CampaignList({
  campaigns = [], // Provide a default empty array
  onShowNotification,
}: CampaignListProps) {
  // Campaign store actions
  const {
    openForm,
    openDeleteDialog,
    filter,
    setFilter,
    clearFilter,
    searchCampaigns,
    pagination,
    setPage,
    setLimit,
    isLoading,
  } = useCampaignStore();

  // Local search state
  const [searchTitle, setSearchTitle] = useState(filter.title || "");

  // Handle row click to open form
  const handleRowClick = (campaign: Campaign) => {
    openForm(campaign);
  };

  // Handle delete click
  const handleDeleteClick = (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation(); // Prevent row click
    openDeleteDialog(campaign);
  };

  // Handle edit click
  const handleEditClick = (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation(); // Prevent row click
    openForm(campaign);
  };

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1); // API is 1-indexed, MUI is 0-indexed
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newFilter = {
      ...filter,
      [name]: value,
    };

    setFilter(newFilter);

    // Don't auto-search on title (we'll use a search button)
    if (name !== "title") {
      searchCampaigns(newFilter);
    }
  };

  // Handle title search
  const handleTitleSearch = () => {
    const newFilter = { ...filter, title: searchTitle };
    setFilter(newFilter);
    searchCampaigns(newFilter);
  };

  // Handle search on enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSearch();
    }
  };

  // Clear title search
  const handleClearSearch = () => {
    setSearchTitle("");
    const newFilter = { ...filter, title: "" };
    setFilter(newFilter);
    searchCampaigns(newFilter);
  };

  // Safety check - if campaigns is not an array, use empty array
  if (!Array.isArray(campaigns)) {
    campaigns = [];
  }

  // Format date for display (MM/DD/YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Render the table content based on loading state and data
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body2" color="textSecondary" display="block">
              Loading campaigns...
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (campaigns.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              No campaigns found with the selected filters
            </Typography>
            {filter.title || filter.type || filter.status ? (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  clearFilter();
                  setSearchTitle("");
                  searchCampaigns({ title: "", type: "", status: "" });
                }}
                sx={{ mt: 1 }}
              >
                Clear filters to view all campaigns
              </Button>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Create your first campaign to get started
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => openForm()}
                  sx={{ mt: 1 }}
                >
                  Create Campaign
                </Button>
              </Box>
            )}
          </TableCell>
        </TableRow>
      );
    }

    return campaigns.map((campaign) => {
      // Calculate status if not provided by backend
      const campaignStatus =
        campaign.status ||
        getCampaignStatus(campaign.startDate, campaign.endDate);

      return (
        <TableRow
          key={campaign.id}
          hover
          onClick={() => handleRowClick(campaign)}
          sx={{ cursor: "pointer" }}
        >
          <TableCell>
            <Typography variant="body2" fontWeight={500}>
              {campaign.title || "Untitled Campaign"}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {campaign.purpose?.length > 60
                ? campaign.purpose.substring(0, 60) + "..."
                : campaign.purpose || "No description"}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">{campaign.type}</Typography>
          </TableCell>
          <TableCell>
            <StatusChip status={campaignStatus as CampaignStatus} />
          </TableCell>
          <TableCell>
            {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
          </TableCell>
          <TableCell>{formatNextActivation(campaign.nextActivation)}</TableCell>
          <TableCell align="right">
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={(e) => handleEditClick(e, campaign)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => handleDeleteClick(e, campaign)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Box>
      {/* Filters - Always visible */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <FilterListIcon color="action" />

        {/* Title Search */}
        <TextField
          name="title"
          label="Search Campaign"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          size="small"
          sx={{ minWidth: 250, flexGrow: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchTitle && (
                  <IconButton
                    aria-label="clear search"
                    onClick={handleClearSearch}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  aria-label="search"
                  onClick={handleTitleSearch}
                  edge="end"
                  size="small"
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          name="type"
          label="Campaign Type"
          value={filter.type || ""}
          onChange={handleFilterChange}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="Cost per Order">Cost per Order</MenuItem>
          <MenuItem value="Cost per Click">Cost per Click</MenuItem>
          <MenuItem value="Buy One Get One">Buy One Get One</MenuItem>
        </TextField>

        <TextField
          select
          name="status"
          label="Status"
          value={filter.status || ""}
          onChange={handleFilterChange}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="upcoming">Upcoming</MenuItem>
          <MenuItem value="ended">Ended</MenuItem>
        </TextField>

        {(filter.title || filter.type || filter.status) && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              clearFilter();
              setSearchTitle("");
              searchCampaigns({ title: "", type: "", status: "" });
            }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      <Divider />

      {/* Table - Always visible */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Range</TableCell>
              <TableCell>Next Activation</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </TableContainer>

      {/* Pagination - Only show when there are items */}
      {!isLoading && pagination.total > 0 && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1} // API is 1-indexed, MUI is 0-indexed
          rowsPerPage={pagination.limit}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Box>
  );
}
